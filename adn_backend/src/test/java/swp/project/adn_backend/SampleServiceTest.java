package swp.project.adn_backend;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import swp.project.adn_backend.dto.request.sample.SampleRequest;
import swp.project.adn_backend.dto.response.sample.SampleResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.*;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.*;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;
import swp.project.adn_backend.service.sample.SampleService;
import swp.project.adn_backend.service.slot.StaffAssignmentTracker;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SampleServiceTest {

    @InjectMocks
    private SampleService sampleService;

    @Mock private SampleRepository sampleRepository;
    @Mock private SampleMapper sampleMapper;
    @Mock private PatientRepository patientRepository;
    @Mock private StaffRepository staffRepository;
    @Mock private ServiceTestRepository serviceTestRepository;
    @Mock private AppointmentRepository appointmentRepository;
    @Mock private StaffMapper staffMapper;
    @Mock private AllSampleResponseMapper allSampleResponseMapper;
    @Mock private AppointmentMapper appointmentMapper;
    @Mock private StaffAssignmentTracker staffAssignmentTracker;
    @Mock private AppointmentService appointmentService;
    @Mock private SlotRepository slotRepository;
    @Mock private Authentication authentication;
    @Mock private Jwt jwt;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleService = new SampleService(
                sampleRepository, sampleMapper, patientRepository,
                staffRepository, serviceTestRepository, appointmentRepository,
                staffMapper, allSampleResponseMapper, appointmentMapper,
                staffAssignmentTracker, appointmentService, slotRepository
        );

        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getClaim("id")).thenReturn(1L); // giả lập ID người dùng
    }

    @Test
    void testCollectSample_success() {
        long patientId = 1L, serviceId = 2L, appointmentId = 3L;

        Staff staff = new Staff(); staff.setStaffId(1L);
        Patient patient = new Patient();
        Appointment appointment = new Appointment();
        Kit kit = new Kit(); kit.setQuantity(1);
        ServiceTest serviceTest = new ServiceTest(); serviceTest.setKit(kit);
        SampleRequest sampleRequest = new SampleRequest();
        Sample sample = new Sample();
        SampleResponse expectedResponse = new SampleResponse();

        when(staffRepository.findById(1L)).thenReturn(Optional.of(staff));
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.of(serviceTest));
        when(sampleMapper.toSample(sampleRequest)).thenReturn(sample);
        when(sampleRepository.save(any())).thenReturn(sample);
        when(sampleMapper.toSampleResponse(any())).thenReturn(expectedResponse);

        SampleResponse actualResponse = sampleService.collectSample(patientId, serviceId, appointmentId, sampleRequest, authentication);
        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    void testCollectSample_kitEmpty_shouldThrow() {
        long patientId = 1L, serviceId = 2L, appointmentId = 3L;

        Staff staff = new Staff(); staff.setStaffId(1L);
        Patient patient = new Patient();
        Appointment appointment = new Appointment();
        Kit kit = new Kit(); kit.setQuantity(0);
        ServiceTest serviceTest = new ServiceTest(); serviceTest.setKit(kit);

        when(staffRepository.findById(1L)).thenReturn(Optional.of(staff));
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.of(serviceTest));

        assertThrows(RuntimeException.class, () -> {
            sampleService.collectSample(patientId, serviceId, appointmentId, new SampleRequest(), authentication);
        });
    }

    @Test
    void testDeleteSample_success() {
        long sampleId = 5L;
        Sample sample = new Sample();
        sample.setSampleStatus(SampleStatus.COLLECTED);

        when(sampleRepository.findById(sampleId)).thenReturn(Optional.of(sample));
        sampleService.deleteSample(sampleId);

        assertEquals(SampleStatus.REJECTED, sample.getSampleStatus());
    }

    @Test
    void testUpdateSampleStatus_invalidTransition_shouldThrow() {
        long sampleId = 10L, appointmentId = 20L;

        Sample sample = new Sample();
        sample.setSampleStatus(SampleStatus.RECEIVED); // current = RECEIVED
        Appointment appointment = new Appointment();

        SampleRequest request = new SampleRequest();
        request.setSampleStatus(SampleStatus.COLLECTED); // backward = invalid

        when(sampleRepository.findById(sampleId)).thenReturn(Optional.of(sample));
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));

        assertThrows(AppException.class, () ->
                sampleService.updateSampleStatus(sampleId, appointmentId, request));
    }

    @Test
    void testUpdateSampleStatus_toReceived_assignLabStaff_success() {
        long sampleId = 10L, appointmentId = 20L;

        Sample sample = new Sample();
        sample.setSampleStatus(SampleStatus.IN_TRANSIT);

        Appointment appointment = new Appointment();
        appointment.setPatients(List.of(new Patient()));

        SampleRequest request = new SampleRequest();
        request.setSampleStatus(SampleStatus.RECEIVED);

        Staff labTech = new Staff(); labTech.setRole("LAB_TECHNICIAN");
        when(sampleRepository.findById(sampleId)).thenReturn(Optional.of(sample));
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(staffRepository.findAll()).thenReturn(List.of(labTech));
        when(staffAssignmentTracker.getNextIndex(anyInt())).thenReturn(0);

        assertDoesNotThrow(() -> {
            sampleService.updateSampleStatus(sampleId, appointmentId, request);
        });
    }
}
