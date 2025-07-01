package swp.project.adn_backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.multipart.MultipartFile;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.request.payment.CreatePaymentRequest;
import swp.project.adn_backend.dto.request.payment.PaymentRequest;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;
import swp.project.adn_backend.dto.request.roleRequest.UserPhoneRequest;
import swp.project.adn_backend.dto.request.serviceRequest.PriceListRequest;
import swp.project.adn_backend.dto.request.updateRequest.UpdateServiceTestRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.*;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult.*;
import swp.project.adn_backend.dto.response.appointment.updateAppointmentStatus.UpdateAppointmentStatusResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.*;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.AppointmentMapper;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;
import swp.project.adn_backend.service.registerServiceTestService.EmailService;
import swp.project.adn_backend.service.registerServiceTestService.ServiceTestService;
import swp.project.adn_backend.service.roleService.PatientService;
import swp.project.adn_backend.service.slot.StaffAssignmentTracker;

public class AppointmentServiceTest {

    @InjectMocks
    private AppointmentService appointmentService;

    @Mock
    private UserRepository userRepository;
    @Mock
    private ServiceTestRepository serviceTestRepository;
    @Mock
    private SlotRepository slotRepository;
    @Mock
    private PriceListRepository priceListRepository;
    @Mock
    private LocationRepository locationRepository;
    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private PatientService patientService;
    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private EmailService emailService;
    @Mock
    private ServiceTestService serviceTestService;
    @Mock
    private AppointmentMapper appointmentMapper;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private Authentication authentication;
    @Mock
    private KitDeliveryStatusRepository kitDeliveryStatusRepository;
    @Mock
    private StaffAssignmentTracker staffAssignmentTracker;
    @Mock
    private CivilServiceRepository civilServiceRepository;
    @Mock
    private Jwt jwt;
    @Mock
    private StaffRepository staffRepository;
    @Mock
    private InvoiceRepository invoiceRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testBookAppointmentAtCenter_success() {
        long userId = 1L;
        long serviceId = 2L;
        long slotId = 3L;
        long locationId = 4L;
        long priceId = 5L;

        Users user = new Users();
        user.setUserId(userId);

        ServiceTest serviceTest = new ServiceTest();
        serviceTest.setDiscounts(new ArrayList<>());

        Slot slot = new Slot();
        slot.setSlotId(slotId);
        slot.setSlotDate(LocalDate.now());
        slot.setSlotStatus(SlotStatus.AVAILABLE);
        Staff staff = new Staff();
        staff.setRole("SAMPLE_COLLECTOR");
        slot.setStaff(Collections.singletonList(staff));

        PriceList priceList = new PriceList();
        priceList.setPrice(100.0);

        Location location = new Location();

        AppointmentRequest appointmentRequest = new AppointmentRequest();
        Appointment appointment = new Appointment();
        appointment.setStaff(staff);

        List<Patient> patients = new ArrayList<>();
        Patient patient = new Patient();
        patients.add(patient);

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPaymentMethod(PaymentMethod.CASH);

        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.of(serviceTest));
        when(slotRepository.findById(slotId)).thenReturn(Optional.of(slot));
        when(priceListRepository.findById(priceId)).thenReturn(Optional.of(priceList));
        when(locationRepository.findById(locationId)).thenReturn(Optional.of(location));
        when(appointmentMapper.toAppointment(appointmentRequest)).thenReturn(appointment);
        when(patientService.registerServiceTest(any(), any(), any())).thenReturn(patients);
        when(appointmentRepository.save(any())).thenReturn(appointment);

        AllAppointmentAtCenterResponse result = appointmentService.bookAppointmentAtCenter(
                appointmentRequest,
                authentication,
                Collections.emptyList(),
                paymentRequest,
                slotId,
                locationId,
                serviceId,
                priceId);

        assertNotNull(result);
        verify(appointmentRepository).save(any());
        verify(paymentRepository).save(any());
        verify(emailService).sendAppointmentAtCenterDetailsEmail(eq(user.getEmail()), any());
    }

    @Test
    void testBookAppointmentAtHome_Success() {
        // Arrange
        long userId = 1L, serviceId = 2L, priceId = 3L;

        Users user = new Users();
        user.setUserId(userId);
        user.setAddress("123 Street");

        ServiceTest serviceTest = new ServiceTest();
        serviceTest.setDiscounts(Collections.emptyList());

        PriceList priceList = new PriceList();
        priceList.setPriceId(priceId);
        priceList.setPrice(300.0);
        priceList.setTime("2 days");

        AppointmentRequest appointmentRequest = new AppointmentRequest();
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPaymentMethod(PaymentMethod.CASH);

        Appointment appointment = new Appointment();
        Patient patient = new Patient();
        List<Patient> registeredPatients = List.of(patient);

        Staff homeStaff = new Staff();
        homeStaff.setRole("STAFF_AT_HOME");
        List<Staff> staffList = List.of(homeStaff);

        Kit kit = new Kit();
        serviceTest.setKit(kit);

        // Mocking JWT & Auth
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(userId);

        // Repository + Mapper setup
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.of(serviceTest));
        when(priceListRepository.findById(priceId)).thenReturn(Optional.of(priceList));
        when(staffRepository.findAll()).thenReturn(staffList);
        when(staffAssignmentTracker.getNextIndex(anyInt())).thenReturn(0);
        when(appointmentMapper.toAppointment(appointmentRequest)).thenReturn(appointment);
        when(patientService.registerServiceTest(anyList(), eq(user), eq(serviceTest))).thenReturn(registeredPatients);
        when(appointmentRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // Mapping for response
        when(appointmentMapper.toShowAppointmentResponse(any())).thenReturn(new ShowAppointmentResponse());
        when(appointmentMapper.toUserAppointmentResponse(any())).thenReturn(new UserAppointmentResponse());
        when(appointmentMapper.toServiceAppointmentResponse(any())).thenReturn(new ServiceAppointmentResponse());
        when(appointmentMapper.toPatientAppointmentService(any())).thenReturn(List.of(new PatientAppointmentResponse()));
        when(appointmentMapper.toKitAppointmentResponse(any())).thenReturn(new KitAppointmentResponse());

        // Act
        AllAppointmentAtHomeResponse response = appointmentService.bookAppointmentAtHome(
                appointmentRequest, authentication, List.of(new PatientRequest()),
                paymentRequest, serviceId, priceId
        );

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getUserAppointmentResponse().size());
        assertEquals(1, response.getServiceAppointmentResponses().size());
        assertEquals(1, response.getPatientAppointmentResponse().size());
        assertNotNull(response.getKitAppointmentResponse());
        verify(appointmentRepository).save(any());
        verify(paymentRepository).save(any());
    }

    @Test
    void ConfirmAppointmentAtHome_Success() {
        // GIVEN
        long userId = 1L;
        long serviceId = 2L;
        long appointmentId = 3L;

        Users user = new Users();
        user.setUserId(userId);
        user.setEmail("user@example.com");

        ServiceTest serviceTest = new ServiceTest();
        Kit kit = new Kit();
        serviceTest.setKit(kit);

        Appointment appointment = new Appointment();
        KitDeliveryStatus deliveryStatus = new KitDeliveryStatus();
        appointment.setKitDeliveryStatus(deliveryStatus);
        appointment.setAppointmentStatus(AppointmentStatus.PENDING);

        UpdateAppointmentStatusResponse statusResponse = new UpdateAppointmentStatusResponse();

        // Mocks
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.of(serviceTest));
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(appointmentMapper.toUpdateAppointmentStatusResponse(any())).thenReturn(statusResponse);
        when(appointmentMapper.toShowAppointmentResponse(any())).thenReturn(new ShowAppointmentResponse());
        when(appointmentMapper.toKitAppointmentResponse(any())).thenReturn(new KitAppointmentResponse());
        when(appointmentMapper.toUserAppointmentResponse(any())).thenReturn(new UserAppointmentResponse());
        when(appointmentMapper.toServiceAppointmentResponse(any())).thenReturn(new ServiceAppointmentResponse());

        // WHEN
        UpdateAppointmentStatusResponse result = appointmentService.ConfirmAppointmentAtHome(
                appointmentId, userId, serviceId
        );

        // THEN
        assertNotNull(result);
        assertEquals(AppointmentStatus.CONFIRMED, appointment.getAppointmentStatus());
        assertEquals(DeliveryStatus.PENDING, appointment.getKitDeliveryStatus().getDeliveryStatus());
        assertNotNull(appointment.getNote());

        verify(emailService).sendAppointmentHomeDetailsEmail(eq(user.getEmail()), any());
    }

    @Test
    void getAppointmentAtHomeToGetSample_Success() {
        // Mock data
        long staffId = 1L;

        Jwt jwt = mock(Jwt.class);
        Authentication auth = mock(Authentication.class);

        when(auth.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(staffId);

        Staff staff = new Staff();
        staff.setRole("STAFF_AT_HOME");

        Users user = new Users();
        ServiceTest serviceTest = new ServiceTest();
        PriceList priceList = new PriceList();
        serviceTest.setPriceLists(List.of(priceList));

        Patient patient = new Patient();
        patient.setPatientStatus(PatientStatus.REGISTERED);

        Appointment appointment = new Appointment();
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        appointment.setPatients(List.of(patient));
        appointment.setUsers(user);
        appointment.setStaff(staff);
        appointment.setServices(serviceTest);
        staff.setAppointments(List.of(appointment));

        when(staffRepository.findById(staffId)).thenReturn(Optional.of(staff));

        // Mocks for mapping
        when(appointmentMapper.toPatientAppointment(any())).thenReturn(new PatientAppointmentResponse());
        when(appointmentMapper.toShowAppointmentResponse(any())).thenReturn(new ShowAppointmentResponse());
        when(appointmentMapper.toUserAppointmentResponse(any())).thenReturn(new UserAppointmentResponse());
        when(appointmentMapper.toStaffAppointmentResponse(any())).thenReturn(new StaffAppointmentResponse());
        when(appointmentMapper.toServiceAppointmentResponse(any())).thenReturn(new ServiceAppointmentResponse());
        when(appointmentMapper.toPriceAppointmentResponse(anyList())).thenReturn(List.of(new PriceAppointmentResponse()));

        // Call service
        List<AllAppointmentAtCenterResponse> result = appointmentService.getAppointmentAtHomeToRecordResult(auth);

        // Verify
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(staffRepository).findById(staffId);
        verify(appointmentMapper).toPatientAppointment(any());
    }

    @Test
    void getHistory_success() {
        // Mock JWT & Auth
        long userId = 1L;
        Authentication authentication = mock(Authentication.class);
        Jwt jwt = mock(Jwt.class);

        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(userId);

        // Mock user
        Users user = new Users();
        user.setUserId(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Prepare appointments
        Appointment centerAppointment = new Appointment();
        centerAppointment.setAppointmentType(AppointmentType.CENTER);
        Slot slot = new Slot();
        Room room = new Room();
        room.setRoomName("Phòng 101");
        slot.setRoom(room);
        centerAppointment.setSlot(slot);
        centerAppointment.setStaff(new Staff());
        centerAppointment.setLocation(new Location());
        centerAppointment.setServices(new ServiceTest());
        centerAppointment.setPayments(new ArrayList<>());

        Appointment homeAppointment = new Appointment();
        homeAppointment.setAppointmentType(AppointmentType.HOME);
        ServiceTest service = new ServiceTest();
        service.setServiceType(ServiceType.CIVIL);
        service.setKit(new Kit());
        homeAppointment.setServices(service);
        homeAppointment.setPayments(new ArrayList<>());

        List<Appointment> appointments = List.of(centerAppointment, homeAppointment);
        when(appointmentRepository.findByUsers_UserId(userId)).thenReturn(appointments);

        // Mocks for mappers
        when(appointmentMapper.toShowAppointmentResponse(any())).thenReturn(new ShowAppointmentResponse());
        when(appointmentMapper.toStaffAppointmentResponse(any())).thenReturn(new StaffAppointmentResponse());
        when(appointmentMapper.toSlotAppointmentResponse(any())).thenReturn(new SlotAppointmentResponse());
        when(appointmentMapper.toServiceAppointmentResponse(any())).thenReturn(new ServiceAppointmentResponse());
        when(appointmentMapper.toLocationAppointmentResponse(any())).thenReturn(new LocationAppointmentResponse());
        when(appointmentMapper.toPaymentAppointmentResponse(any())).thenReturn(new ArrayList<>());
        when(appointmentMapper.toKitAppointmentResponse(any())).thenReturn(new KitAppointmentResponse());

        // Call service
        AllAppointmentResponse response = appointmentService.getHistory(authentication);

        // Verify
        assertNotNull(response);
        assertEquals(1, response.getAllAppointmentAtCenterResponse().size());
        assertEquals(1, response.getAllAppointmentAtHomeResponse().size());
        verify(appointmentRepository).findByUsers_UserId(userId);
    }

    @Test
    void getAllAppointmentsResult_success() {
        // Given
        long userId = 1L;
        long appointmentId = 10L;

        Authentication auth = mock(Authentication.class);
        Jwt jwt = mock(Jwt.class);
        when(auth.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(userId);

        Users user = new Users();
        user.setUserId(userId);

        Appointment appointment = new Appointment();
        appointment.setAppointmentStatus(AppointmentStatus.COMPLETED);
        appointment.setUsers(user);
        appointment.setPatients(List.of(new Patient()));
        appointment.setServices(new ServiceTest());
        appointment.setStaff(new Staff());
        appointment.setSampleList(List.of(new Sample()));

        // Mock result
        Result result = new Result();
        result.setResultStatus(ResultStatus.COMPLETED);

        ResultDetail resultDetail = new ResultDetail();
        ResultLocus locus = new ResultLocus();
        resultDetail.setResultLoci(List.of(locus));
        result.setResultDetail(resultDetail);
        appointment.setResults(List.of(result));

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.findByUsers_UserId(userId)).thenReturn(List.of(appointment));

        // Mocks for mappers
        when(appointmentMapper.toShowAppointmentResponse(any())).thenReturn(new ShowAppointmentResponse());
        when(appointmentMapper.toStaffAppointmentResponse(any())).thenReturn(new StaffAppointmentResponse());
        when(appointmentMapper.toServiceAppointmentResponse(any())).thenReturn(new ServiceAppointmentResponse());
        when(appointmentMapper.toPatientAppointmentService(any())).thenReturn(List.of(new PatientAppointmentResponse()));
        when(appointmentMapper.toSampleAppointmentResponse(any())).thenReturn(List.of(new SampleAppointmentResponse()));
        when(appointmentMapper.toUserAppointmentResponse(any())).thenReturn(new UserAppointmentResponse());
        when(appointmentMapper.toResultAppointmentResponse(any())).thenReturn(new ResultAppointmentResponse());
        when(appointmentMapper.toResultDetailAppointmentResponse(any())).thenReturn(new ResultDetailAppointmentResponse());
        when(appointmentMapper.toResultLocusAppointmentResponse(any())).thenReturn(new ResultLocusAppointmentResponse());

        // When
        List<AllAppointmentResult> results = appointmentService.getAllAppointmentsResult(auth, appointmentId);

        // Then
        assertNotNull(results);
        assertEquals(1, results.size());
        AllAppointmentResult result1 = results.get(0);
        assertEquals(1, result1.getResultAppointmentResponse().size());
        assertEquals(1, result1.getResultDetailAppointmentResponse().size());
        assertEquals(1, result1.getResultLocusAppointmentResponse().size());
        verify(appointmentRepository).findById(appointmentId);
        verify(userRepository).findById(userId);
    }

    @Test
    void testCancelledAppointment_Success() {
        long appointmentId = 1L;

        // Mock patient
        Patient patient = new Patient();
        patient.setPatientStatus(PatientStatus.REGISTERED);

        // Mock slot
        Slot slot = new Slot();
        slot.setSlotStatus(SlotStatus.BOOKED);

        // Mock appointment
        Appointment appointment = new Appointment();
        appointment.setAppointmentStatus(AppointmentStatus.PENDING);
        appointment.setPatients(List.of(patient));
        appointment.setSlot(slot);

        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));

        appointmentService.cancelledAppointment(appointmentId);

        assertEquals(AppointmentStatus.CANCELLED, appointment.getAppointmentStatus());
        assertEquals(SlotStatus.AVAILABLE, appointment.getSlot().getSlotStatus());
        assertEquals(PatientStatus.CANCELLED, patient.getPatientStatus());

        verify(appointmentRepository).findById(appointmentId);
    }
    @Test
    void testGetAppointmentOfUser_Success() {
        // SETUP dữ liệu
        Long userId = 1L;
        Staff staff = new Staff();
        staff.setStaffId(userId);
        staff.setRole("CASHIER");

        Users user = new Users();
        user.setUserId(2L);
        user.setPhone("123456789");

        // Appointment setup
        Appointment appointment = new Appointment();
        appointment.setAppointmentType(AppointmentType.CENTER);
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        appointment.setUsers(user);

        // ServiceTest setup
        ServiceTest service = new ServiceTest();
        service.setServiceName("ADN Test");
        service.setPriceLists(List.of(new PriceList())); // tránh null
        appointment.setServices(service);

        // Payment setup
        Payment payment = new Payment();
        payment.setPaymentStatus(PaymentStatus.PENDING);
        appointment.setPayments(List.of(payment));

        user.setAppointments(List.of(appointment));

        // MOCK các repository
        when(staffRepository.findById(userId)).thenReturn(Optional.of(staff));
        when(userRepository.findByPhone("123456789")).thenReturn(Optional.of(user));

        // MOCK authentication
        Authentication authentication = mock(Authentication.class);
        Jwt jwt = mock(Jwt.class);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(userId);

        // MOCK mapper
        when(appointmentMapper.toShowAppointmentResponse(any())).thenReturn(new ShowAppointmentResponse());
        when(appointmentMapper.toServiceAppointmentResponse(any())).thenReturn(new ServiceAppointmentResponse());
        when(appointmentMapper.toUserAppointmentResponse(any())).thenReturn(new UserAppointmentResponse());
        when(appointmentMapper.toPriceAppointmentResponse(any())).thenReturn(List.of(new PriceAppointmentResponse()));
        when(appointmentMapper.toPaymentAppointmentResponse(any())).thenReturn(List.of(new PaymentAppointmentResponse()));

        // CALL method
        UserPhoneRequest request = new UserPhoneRequest();
        request.setPhone("123456789");

        List<AllAppointmentAtCenterUserResponse> result = appointmentService.getAppointmentOfUser(authentication, request);

        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void testGetAppointmentOfUser_NotCashier_ThrowsException() {
        Long staffId = 2L;

        Jwt jwt = mock(Jwt.class);
        when(jwt.getClaim("id")).thenReturn(staffId);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(jwt);

        Staff staff = new Staff();
        staff.setRole("STAFF_AT_HOME"); // not cashier
        when(staffRepository.findById(staffId)).thenReturn(Optional.of(staff));

        // THEN
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                appointmentService.getAppointmentOfUser(auth, new UserPhoneRequest("0123456789"))
        );
        assertEquals("Bạn không phải là thu ngân", ex.getMessage());
    }
    @Test
    void testCreatePayment_Success() {
        // GIVEN
        long paymentId = 1L;
        long serviceId = 2L;

        Payment payment = new Payment();
        payment.setPaymentMethod(PaymentMethod.CASH);
        payment.setAmount(500.0);

        Appointment appointment = new Appointment();
        payment.setAppointment(appointment);

        ServiceTest serviceTest = new ServiceTest();
        serviceTest.setServiceName("Xét nghiệm ADN");

        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(payment));
        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.of(serviceTest));

        // WHEN
        CreatePaymentRequest request = appointmentService.createPayment(paymentId, serviceId);

        // THEN
        assertNotNull(request);
        assertEquals(500.0, request.getAmount());
        assertEquals("Xét nghiệm ADN", request.getOrderInfo());
        assertTrue(request.getTxnRef().length() <= 20);
        assertEquals("http://localhost:5173/vnpay-payment", request.getReturnUrlBase());

        verify(invoiceRepository).save(any(Invoice.class));
    }

    @Test
    void testCreatePayment_PaymentNotFound_ThrowsAppException() {
        when(paymentRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(AppException.class, () ->
                appointmentService.createPayment(1L, 2L));
    }

    @Test
    void testCreatePayment_InvalidPaymentMethod_ThrowsRuntimeException() {
        Payment payment = new Payment();
        payment.setPaymentMethod(PaymentMethod.VN_PAY); // Not cash
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));

        assertThrows(RuntimeException.class, () ->
                appointmentService.createPayment(1L, 2L));
    }

    @Test
    void testCreatePayment_ServiceNotFound_ThrowsAppException() {
        Payment payment = new Payment();
        payment.setPaymentMethod(PaymentMethod.CASH);
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        when(serviceTestRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(AppException.class, () ->
                appointmentService.createPayment(1L, 2L));
    }



}

