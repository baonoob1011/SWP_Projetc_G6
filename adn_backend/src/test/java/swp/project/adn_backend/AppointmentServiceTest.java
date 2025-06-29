package swp.project.adn_backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.request.payment.PaymentRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.AllAppointmentAtCenterResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.PaymentMethod;
import swp.project.adn_backend.enums.SlotStatus;
import swp.project.adn_backend.mapper.AppointmentMapper;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;
import swp.project.adn_backend.service.registerServiceTestService.EmailService;
import swp.project.adn_backend.service.roleService.PatientService;

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
    private AppointmentMapper appointmentMapper;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private Authentication authentication;
    @Mock
    private Jwt jwt;

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

}

