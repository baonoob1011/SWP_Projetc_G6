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
    void testBookAppointmentAtCenter_success() {
        // Arrange
        long slotId = 1L, locationId = 2L, serviceId = 3L, priceId = 4L;
        Authentication auth = mock(Authentication.class);
        Jwt jwt = mock(Jwt.class);
        when(auth.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(10L);

        // Mock user
        Users user = new Users();
        user.setUserId(10L);
        user.setEmail("test@example.com");
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));

        // Mock slot with staff
        Slot slot = new Slot();
        slot.setSlotId(slotId);
        slot.setSlotStatus(SlotStatus.AVAILABLE);
        slot.setSlotDate(LocalDate.of(2025, 7, 11));
        Staff staff = new Staff();
        staff.setStaffId(99L);
        staff.setRole("SAMPLE_COLLECTOR");
        slot.setStaff(List.of(staff));
        when(slotRepository.findById(slotId)).thenReturn(Optional.of(slot));

        // Mock service
        ServiceTest serviceTest = new ServiceTest();
        serviceTest.setServiceId(serviceId);
        serviceTest.setDiscounts(List.of());
        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.of(serviceTest));

        // Mock price
        PriceList priceList = new PriceList();
        priceList.setPrice(100000);
        when(priceListRepository.findById(priceId)).thenReturn(Optional.of(priceList));

        // Mock location
        Location location = new Location();
        location.setLocationId(locationId);
        location.setAddressLine("123 Main");
        location.setDistrict("District A");
        location.setCity("City Z");
        when(locationRepository.findById(locationId)).thenReturn(Optional.of(location));

        // Mock appointment
        AppointmentRequest appointmentRequest = new AppointmentRequest();
        Appointment appointment = new Appointment();
        appointment.setSlot(slot);
        appointment.setUsers(user);
        when(appointmentMapper.toAppointment(appointmentRequest)).thenReturn(appointment);

        // Mock patients
        List<PatientRequest> patientRequests = new ArrayList<>();
        List<Patient> patients = List.of(new Patient());
        when(patientService.registerServiceTest(anyList(), eq(user), eq(serviceTest))).thenReturn(patients);

        // Mock appointment save
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        // Mock payment request
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPaymentMethod(PaymentMethod.CASH);

        // Mock all response mappers (these must return dummy data to prevent null)
        when(appointmentMapper.toShowAppointmentResponse(any())).thenReturn(new ShowAppointmentResponse());
        when(appointmentMapper.toUserAppointmentResponse(any())).thenReturn(new UserAppointmentResponse());
        when(appointmentMapper.toStaffAppointmentResponse(any())).thenReturn(new StaffAppointmentResponse());
        when(appointmentMapper.toSlotAppointmentResponse(any())).thenReturn(new SlotAppointmentResponse());
        when(appointmentMapper.toRoomAppointmentResponse(any())).thenReturn(new RoomAppointmentResponse());
        when(appointmentMapper.toServiceAppointmentResponse(any())).thenReturn(new ServiceAppointmentResponse());
        when(appointmentMapper.toLocationAppointmentResponse(any())).thenReturn(new LocationAppointmentResponse());
        when(appointmentMapper.toPriceAppointmentResponse(any())).thenReturn(List.of(new PriceAppointmentResponse()));
        when(appointmentMapper.toPatientAppointmentService(any())).thenReturn(List.of(new PatientAppointmentResponse()));

        // Act
        AllAppointmentAtCenterResponse response = appointmentService.bookAppointmentAtCenter(
                appointmentRequest, auth, patientRequests, paymentRequest, slotId, locationId, serviceId, priceId
        );

        // Assert
        assertNotNull(response);
        verify(appointmentRepository).save(any(Appointment.class));
        verify(paymentRepository).save(any(Payment.class));
        verify(emailService).sendAppointmentAtCenterDetailsEmail(eq("test@example.com"), any());
    }
    @Test
    void testBookAppointmentAtCenter_slotNotFound() {
        // Arrange
        long slotId = 1L, locationId = 2L, serviceId = 3L, priceId = 4L;
        Authentication auth = mock(Authentication.class);
        Jwt jwt = mock(Jwt.class);
        when(auth.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(10L);

        // Mock user to avoid USER_NOT_EXISTED
        Users user = new Users();
        user.setUserId(10L);
        user.setEmail("test@example.com");
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));

        when(slotRepository.findById(slotId)).thenReturn(Optional.empty());

        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.of(new ServiceTest()));
        when(priceListRepository.findById(priceId)).thenReturn(Optional.of(new PriceList()));
        when(locationRepository.findById(locationId)).thenReturn(Optional.of(new Location()));

        AppointmentRequest appointmentRequest = new AppointmentRequest();
        List<PatientRequest> patientRequests = new ArrayList<>();
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPaymentMethod(PaymentMethod.CASH);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            appointmentService.bookAppointmentAtCenter(
                    appointmentRequest, auth, patientRequests, paymentRequest,
                    slotId, locationId, serviceId, priceId
            );
        });

        assertEquals(ErrorCodeUser.SLOT_NOT_EXISTS, exception.getErrorCode());
    }

    @Test
    void testBookAppointmentAtHome_serviceNotFound() {
        // Arrange
        long serviceId = 1L;
        long priceId = 2L;

        Authentication authentication = mock(Authentication.class);
        Jwt jwt = mock(Jwt.class);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(10L);

        // Mock user to avoid USER_NOT_EXISTED
        Users user = new Users();
        user.setUserId(10L);
        user.setAddress("123 Street");
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));

        // 👇 Do NOT mock serviceTestRepository => simulate service not found
        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.empty());

        // Mock price to prevent it from throwing error
        PriceList priceList = new PriceList();
        priceList.setPriceId(priceId);
        priceList.setPrice(100000);
        priceList.setTime("Morning");
        when(priceListRepository.findById(priceId)).thenReturn(Optional.of(priceList));

        AppointmentRequest appointmentRequest = new AppointmentRequest();
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPaymentMethod(PaymentMethod.CASH);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            appointmentService.bookAppointmentAtHome(
                    appointmentRequest,
                    authentication,
                    new ArrayList<>(),
                    paymentRequest,
                    serviceId,
                    priceId
            );
        });

        assertEquals(ErrorCodeUser.SERVICE_NOT_EXISTS, exception.getErrorCode());
    }


    @Test
    void testBookAppointmentAtHome_success() {
        // Arrange
        long serviceId = 1L;
        long priceId = 2L;

        Authentication authentication = mock(Authentication.class);
        Jwt jwt = mock(Jwt.class);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(10L);

        Users user = new Users();
        user.setUserId(10L);
        user.setAddress("123 Street");
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));

        ServiceTest serviceTest = new ServiceTest();
        Kit kit = new Kit();
        serviceTest.setKit(kit);
        serviceTest.setDiscounts(new ArrayList<>());
        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.of(serviceTest));

        PriceList priceList = new PriceList();
        priceList.setPriceId(priceId);
        priceList.setPrice(100000);
        priceList.setTime("Morning");
        when(priceListRepository.findById(priceId)).thenReturn(Optional.of(priceList));

        // Mock staff list
        List<Staff> staffList = new ArrayList<>();
        Staff staff = new Staff();
        staff.setRole("STAFF_AT_HOME");
        staffList.add(staff);
        when(staffRepository.findAll()).thenReturn(staffList);

        // Mock appointment and mapper
        AppointmentRequest appointmentRequest = new AppointmentRequest();
        Appointment appointment = new Appointment();
        appointment.setUsers(user);
        when(appointmentMapper.toAppointment(appointmentRequest)).thenReturn(appointment);

        List<Patient> patients = List.of(new Patient());
        when(patientService.registerServiceTest(any(), eq(user), eq(serviceTest))).thenReturn(patients);

        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);
        when(kitDeliveryStatusRepository.save(any())).thenReturn(null);
        when(paymentRepository.save(any())).thenReturn(null);

        // Mock all appointmentMapper responses
        when(appointmentMapper.toUserAppointmentResponse(user)).thenReturn(new UserAppointmentResponse());
        when(appointmentMapper.toShowAppointmentResponse(any())).thenReturn(new ShowAppointmentResponse());
        when(appointmentMapper.toKitAppointmentResponse(any())).thenReturn(new KitAppointmentResponse());
        when(appointmentMapper.toServiceAppointmentResponse(any())).thenReturn(new ServiceAppointmentResponse());
        when(appointmentMapper.toPatientAppointmentService(anyList()))
                .thenReturn(List.of(new PatientAppointmentResponse()));

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPaymentMethod(PaymentMethod.CASH);

        // Act
        AllAppointmentAtHomeResponse response = appointmentService.bookAppointmentAtHome(
                appointmentRequest,
                authentication,
                new ArrayList<>(),
                paymentRequest,
                serviceId,
                priceId
        );

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getUserAppointmentResponse().size()); // ✅ Fixed assertion
        verify(appointmentRepository).save(any(Appointment.class));
        verify(paymentRepository).save(any(Payment.class));
        verify(kitDeliveryStatusRepository).save(any());
    }
    @Test
    void testConfirmAppointmentAtHome_success() {
        // Arrange
        long appointmentId = 1L;
        long userId = 10L;
        long serviceId = 20L;

        // User mock
        Users user = new Users();
        user.setUserId(userId);
        user.setEmail("test@example.com");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Kit + ServiceTest mock
        Kit kit = new Kit();
        kit.setQuantity(5); // must > 0
        ServiceTest serviceTest = new ServiceTest();
        serviceTest.setKit(kit);
        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.of(serviceTest));

        // Appointment mock
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(appointmentId);
        appointment.setUsers(user);
        appointment.setAppointmentStatus(AppointmentStatus.PENDING);
        KitDeliveryStatus deliveryStatus = new KitDeliveryStatus();
        appointment.setKitDeliveryStatus(deliveryStatus);
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));

        // Mapper return mock objects
        UpdateAppointmentStatusResponse statusResponse = new UpdateAppointmentStatusResponse();
        when(appointmentMapper.toUpdateAppointmentStatusResponse(appointment)).thenReturn(statusResponse);
        when(appointmentMapper.toShowAppointmentResponse(appointment)).thenReturn(new ShowAppointmentResponse());
        when(appointmentMapper.toKitAppointmentResponse(kit)).thenReturn(new KitAppointmentResponse());
        when(appointmentMapper.toUserAppointmentResponse(user)).thenReturn(new UserAppointmentResponse());
        when(appointmentMapper.toServiceAppointmentResponse(serviceTest)).thenReturn(new ServiceAppointmentResponse());

        // Act
        UpdateAppointmentStatusResponse result = appointmentService.ConfirmAppointmentAtHome(
                appointmentId, userId, serviceId
        );

        // Assert
        assertNotNull(result);
        assertEquals(statusResponse, result);
        assertEquals(AppointmentStatus.CONFIRMED, appointment.getAppointmentStatus());
        assertEquals(DeliveryStatus.PENDING, appointment.getKitDeliveryStatus().getDeliveryStatus());
        assertEquals(4, serviceTest.getKit().getQuantity()); // 5 - 1

        // Verify interactions
        verify(userRepository).findById(userId);
        verify(serviceTestRepository).findById(serviceId);
        verify(appointmentRepository).findById(appointmentId);
        verify(emailService).sendAppointmentHomeDetailsEmail(eq(user.getEmail()), any());
    }
    @Test
    void testGetAppointmentByStaffId_success() {
        // Arrange
        Authentication authentication = mock(Authentication.class);
        Jwt jwt = mock(Jwt.class);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(1L);

        // Staff mock
        Staff staff = new Staff();
        staff.setStaffId(1L);
        staff.setRole("LAB_TECHNICIAN");

        // Appointment CENTER
        Appointment centerAppointment = new Appointment();
        centerAppointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        centerAppointment.setAppointmentType(AppointmentType.CENTER);

        Room room = new Room();
        room.setRoomName("Phòng A");
        Slot slot = new Slot();
        slot.setRoom(room);
        centerAppointment.setSlot(slot);

        ServiceTest serviceCenter = new ServiceTest();
        Kit kit = new Kit();
        serviceCenter.setKit(kit);
        centerAppointment.setServices(serviceCenter);

        Patient patient1 = new Patient();
        List<Patient> patientsCenter = List.of(patient1);
        centerAppointment.setPatients(patientsCenter);

        // Appointment HOME
        Appointment homeAppointment = new Appointment();
        homeAppointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        homeAppointment.setAppointmentType(AppointmentType.HOME);

        ServiceTest serviceHome = new ServiceTest();
        serviceHome.setServiceType(ServiceType.CIVIL);
        Kit kitHome = new Kit();
        serviceHome.setKit(kitHome);
        homeAppointment.setServices(serviceHome);

        Patient patient2 = new Patient();
        homeAppointment.setPatients(List.of(patient2));

        List<Appointment> appointments = List.of(centerAppointment, homeAppointment);
        staff.setAppointments(appointments);

        when(staffRepository.findById(1L)).thenReturn(Optional.of(staff));

        // Mocks for mapper
        when(appointmentMapper.toShowAppointmentResponse(any())).thenReturn(new ShowAppointmentResponse());
        when(appointmentMapper.toServiceAppointmentResponse(any())).thenReturn(new ServiceAppointmentResponse());
        when(appointmentMapper.toPatientAppointment(any())).thenReturn(new PatientAppointmentResponse());
        when(appointmentMapper.toKitAppointmentResponse(any())).thenReturn(new KitAppointmentResponse());

        // Act
        AllAppointmentResponse response = appointmentService.getAppointmentByStaffId(authentication);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getAllAppointmentAtCenterResponse().size());
        assertEquals(1, response.getAllAppointmentAtHomeResponse().size());

        verify(staffRepository).findById(1L);
        verify(appointmentMapper, atLeastOnce()).toShowAppointmentResponse(any());
        verify(appointmentMapper, atLeastOnce()).toServiceAppointmentResponse(any());
        verify(appointmentMapper, atLeastOnce()).toPatientAppointment(any());
        verify(appointmentMapper, atLeastOnce()).toKitAppointmentResponse(any());
    }

    @Test
    void getAllAppointments_success() {
        // Arrange
        long userId = 10L;
        Authentication authentication = mock(Authentication.class);
        Jwt jwt = mock(Jwt.class);

        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(userId);

        Users user = new Users();
        user.setUserId(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        Appointment centerAppointment = new Appointment();
        centerAppointment.setAppointmentType(AppointmentType.CENTER);
        centerAppointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        centerAppointment.setUsers(user);
        centerAppointment.setSlot(new Slot()); // you may mock slot and room name if needed
        centerAppointment.setLocation(new Location());
        centerAppointment.setStaff(new Staff());
        centerAppointment.setServices(new ServiceTest());
        centerAppointment.setPayments(new ArrayList<>());

        Appointment homeAppointment = new Appointment();
        homeAppointment.setAppointmentType(AppointmentType.HOME);
        homeAppointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        homeAppointment.setUsers(user);
        ServiceTest homeService = new ServiceTest();
        homeService.setServiceType(ServiceType.CIVIL);
        homeService.setKit(new Kit());
        homeAppointment.setServices(homeService);
        homeAppointment.setStaff(new Staff());
        homeAppointment.setPayments(new ArrayList<>());

        when(appointmentRepository.findByUsers_UserId(userId))
                .thenReturn(new ArrayList<>(List.of(centerAppointment, homeAppointment))); // ✅ mutable


        // Mock mapping responses
        when(appointmentMapper.toShowAppointmentResponse(any())).thenReturn(new ShowAppointmentResponse());
        when(appointmentMapper.toStaffAppointmentResponse(any())).thenReturn(new StaffAppointmentResponse());
        when(appointmentMapper.toSlotAppointmentResponse(any())).thenReturn(new SlotAppointmentResponse());
        when(appointmentMapper.toServiceAppointmentResponse(any())).thenReturn(new ServiceAppointmentResponse());
        when(appointmentMapper.toLocationAppointmentResponse(any())).thenReturn(new LocationAppointmentResponse());
        when(appointmentMapper.toKitAppointmentResponse(any())).thenReturn(new KitAppointmentResponse());
        when(appointmentMapper.toPaymentAppointmentResponse(any())).thenReturn(new ArrayList<>());

        // Act
        AllAppointmentResponse response = appointmentService.getAllAppointments(authentication);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getAllAppointmentAtCenterResponse().size());
        assertEquals(1, response.getAllAppointmentAtHomeResponse().size());

        verify(appointmentRepository).findByUsers_UserId(userId);
        verify(userRepository).findById(userId);
    }

    @Test
    void testGetAppointmentOfUser_success() {
        // Arrange
        Long staffId = 1L;
        Long userId = 2L;
        String phone = "0987654321";

        Authentication authentication = mock(Authentication.class);
        Jwt jwt = mock(Jwt.class);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(staffId);

        Staff staff = new Staff();
        staff.setRole("CASHIER");
        when(staffRepository.findById(staffId)).thenReturn(Optional.of(staff));

        Users user = new Users();
        user.setPhone(phone);
        user.setUserId(userId);

        Appointment appointment = new Appointment();
        appointment.setAppointmentType(AppointmentType.CENTER);
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        appointment.setUsers(user);
        appointment.setServices(new ServiceTest());

        Payment payment = new Payment();
        payment.setPaymentStatus(PaymentStatus.PENDING);
        appointment.setPayments(List.of(payment));
        user.setAppointments(List.of(appointment));

        when(userRepository.findByPhone(phone)).thenReturn(Optional.of(user));

        // Mocks for mappers
        when(appointmentMapper.toShowAppointmentResponse(any())).thenReturn(new ShowAppointmentResponse());
        when(appointmentMapper.toServiceAppointmentResponse(any())).thenReturn(new ServiceAppointmentResponse());
        when(appointmentMapper.toUserAppointmentResponse(any())).thenReturn(new UserAppointmentResponse());
        when(appointmentMapper.toPriceAppointmentResponse(any())).thenReturn(List.of(new PriceAppointmentResponse()));
        when(appointmentMapper.toPaymentAppointmentResponse(any())).thenReturn(List.of(new PaymentAppointmentResponse()));

        UserPhoneRequest userPhoneRequest = new UserPhoneRequest();
        userPhoneRequest.setPhone(phone);

        // Act
        List<AllAppointmentAtCenterUserResponse> responses =
                appointmentService.getAppointmentOfUser(authentication, userPhoneRequest);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        verify(userRepository).findByPhone(phone);
        verify(staffRepository).findById(staffId);
    }
    @Test
    void testUpdateAppointmentToGetSampleAgain_success() {
        // Arrange
        long appointmentId = 1L;
        Room room = new Room();
        Location location = new Location();
        room.setLocation(location);

        Slot newSlot = new Slot();
        newSlot.setSlotDate(LocalDate.now().plusDays(1));
        newSlot.setSlotStatus(SlotStatus.AVAILABLE);
        newSlot.setRoom(room);

        Appointment appointment = new Appointment();
        appointment.setAppointmentId(appointmentId);
        appointment.setAppointmentDate(LocalDate.now());
        appointment.setSlot(new Slot());

        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(slotRepository.findBySlotDateAndSlotStatus(any(), eq(SlotStatus.AVAILABLE)))
                .thenReturn(List.of(newSlot));

        // Act
        appointmentService.updateAppointmentToGetSampleAgain(appointmentId);

        // Assert
        assertEquals(AppointmentType.CENTER, appointment.getAppointmentType());
        assertEquals(AppointmentStatus.CONFIRMED, appointment.getAppointmentStatus());
        assertEquals(location, appointment.getLocation());
        assertEquals(newSlot, appointment.getSlot());
        assertEquals(SlotStatus.BOOKED, newSlot.getSlotStatus());
    }

}

