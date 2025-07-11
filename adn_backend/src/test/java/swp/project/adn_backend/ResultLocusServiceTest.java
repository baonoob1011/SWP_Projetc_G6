package swp.project.adn_backend;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import swp.project.adn_backend.dto.request.result.ResultLocusRequest;
import swp.project.adn_backend.dto.response.result.ResultDetailResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.*;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.ResultDetailsMapper;
import swp.project.adn_backend.mapper.ResultLocusMapper;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.result.ResultLocusService;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ResultLocusServiceTest {

    @InjectMocks
    private ResultLocusService resultLocusService;

    @Mock
    private ResultRepository resultRepository;
    @Mock
    private ResultLocusMapper resultLocusMapper;
    @Mock
    private SampleRepository sampleRepository;
    @Mock
    private ResultLocusRepository resultLocusRepository;
    @Mock
    private ResultAlleleRepository resultAlleleRepository;
    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private LocusRepository locusRepository;
    @Mock
    private ResultDetailRepository resultDetailRepository;
    @Mock
    private ResultDetailsMapper resultDetailsMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        resultLocusService = new ResultLocusService(resultRepository, resultLocusMapper, sampleRepository, resultLocusRepository,
                resultAlleleRepository, appointmentRepository, locusRepository, resultDetailRepository, resultDetailsMapper);
    }

    @Test
    void testCreateResultLocusAndDetail_success() {
        long sampleId1 = 1L, sampleId2 = 2L, appointmentId = 10L;

        // Sample 1 setup
        Sample sample1 = new Sample();
        sample1.setSampleId(sampleId1);
        sample1.setSampleStatus(SampleStatus.RECEIVED);
        sample1.setSampleCode("FATHER");
        sample1.setCollectionDate(LocalDate.now());

        // Sample 2 setup
        Sample sample2 = new Sample();
        sample2.setSampleId(sampleId2);
        sample2.setSampleStatus(SampleStatus.RECEIVED);
        sample2.setSampleCode("CHILD");

        // Appointment setup
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(appointmentId);
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        Slot slot = new Slot();
        slot.setSlotStatus(SlotStatus.BOOKED);
        slot.setStaff(new ArrayList<>());
        appointment.setSlot(slot);
        appointment.setPatients(List.of(new Patient()));
        ServiceTest service = new ServiceTest(); // constructor mặc định
        service.setServiceType(ServiceType.ADMINISTRATIVE); // gán enum
        appointment.setServices(service);

        // Allele setup
        Locus locus = new Locus();
        locus.setLocusId(100L);
        locus.setLocusName("D13S317");

        ResultAllele fatherAllele1 = new ResultAllele();
        fatherAllele1.setSample(sample1);
        fatherAllele1.setLocus(locus);
        fatherAllele1.setAlleleValue(12.0);
        fatherAllele1.setAllelePosition("1");
        fatherAllele1.setAlleleStatus(AlleleStatus.VALID);
        ResultAllele fatherAllele2 = new ResultAllele();
        fatherAllele2.setSample(sample1);
        fatherAllele2.setLocus(locus);
        fatherAllele2.setAlleleValue(14.0);
        fatherAllele2.setAllelePosition("2");
        fatherAllele2.setAlleleStatus(AlleleStatus.VALID);        sample1.setResultAlleles(List.of(fatherAllele1, fatherAllele2));


        ResultAllele childAllele1 = new ResultAllele();
        childAllele1.setSample(sample2);
        childAllele1.setLocus(locus);
        childAllele1.setAlleleValue(12.0);
        childAllele1.setAllelePosition("1");
        childAllele1.setAlleleStatus(AlleleStatus.VALID);

        ResultAllele childAllele2 = new ResultAllele();
        childAllele2.setSample(sample2);
        childAllele2.setLocus(locus);
        childAllele2.setAlleleValue(15.0);
        childAllele2.setAllelePosition("2");
        childAllele2.setAlleleStatus(AlleleStatus.VALID);
        sample2.setResultAlleles(List.of(childAllele1, childAllele2));

        ResultDetailResponse mockResponse = new ResultDetailResponse();

        // Mocks
        when(sampleRepository.findById(sampleId1)).thenReturn(Optional.of(sample1));
        when(sampleRepository.findById(sampleId2)).thenReturn(Optional.of(sample2));
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(locusRepository.findById(100L)).thenReturn(Optional.of(locus));
        when(resultDetailsMapper.toResultDetailResponse(any())).thenReturn(mockResponse);

        // Call
        ResultDetailResponse result = resultLocusService.createResultLocusAndDetail(
                sampleId1, sampleId2, appointmentId, new ResultLocusRequest());

        // Verify
        assertNotNull(result);
        verify(resultRepository, times(1)).save(any());
        verify(resultDetailRepository, times(1)).save(any());
        verify(resultLocusRepository, atLeastOnce()).save(any());
    }

    @Test
    void testCreateResultLocusAndDetail_sample1Rejected_shouldThrow() {
        long sampleId1 = 1L, sampleId2 = 2L, appointmentId = 10L;

        Sample sample1 = new Sample();
        sample1.setSampleId(sampleId1);
        sample1.setSampleStatus(SampleStatus.REJECTED);

        Sample sample2 = new Sample();
        sample2.setSampleId(sampleId2);
        sample2.setSampleStatus(SampleStatus.RECEIVED);

        Appointment appointment = new Appointment();
        appointment.setAppointmentId(appointmentId);
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);

        when(sampleRepository.findById(sampleId1)).thenReturn(Optional.of(sample1));
        when(sampleRepository.findById(sampleId2)).thenReturn(Optional.of(sample2));
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            resultLocusService.createResultLocusAndDetail(sampleId1, sampleId2, appointmentId, new ResultLocusRequest());
        });

        assertEquals("1 trong 2 mẫu này không hợp lệ", ex.getMessage());
    }
    @Test
    void testCreateResultLocusAndDetail_appointmentCompleted_shouldThrow() {
        long sampleId1 = 1L, sampleId2 = 2L, appointmentId = 10L;

        Sample sample1 = new Sample();
        sample1.setSampleId(sampleId1);
        sample1.setSampleStatus(SampleStatus.RECEIVED);

        Sample sample2 = new Sample();
        sample2.setSampleId(sampleId2);
        sample2.setSampleStatus(SampleStatus.RECEIVED);

        Appointment appointment = new Appointment();
        appointment.setAppointmentId(appointmentId);
        appointment.setAppointmentStatus(AppointmentStatus.COMPLETED);

        when(sampleRepository.findById(sampleId1)).thenReturn(Optional.of(sample1));
        when(sampleRepository.findById(sampleId2)).thenReturn(Optional.of(sample2));
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            resultLocusService.createResultLocusAndDetail(sampleId1, sampleId2, appointmentId, new ResultLocusRequest());
        });

        assertEquals("Đơn đăng kí này đã có kết quả", ex.getMessage());
    }
    @Test
    void testCreateResultLocusAndDetail_sampleNotFound_shouldThrow() {
        long sampleId1 = 1L, sampleId2 = 2L, appointmentId = 10L;

        when(sampleRepository.findById(sampleId1)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () -> {
            resultLocusService.createResultLocusAndDetail(sampleId1, sampleId2, appointmentId, new ResultLocusRequest());
        });

        assertEquals("SAMPLE_NOT_EXISTS", ex.getErrorCode().name());
    }
    @Test
    void testCreateResultLocusAndDetail_appointmentNotFound_shouldThrow() {
        long sampleId1 = 1L, sampleId2 = 2L, appointmentId = 10L;

        Sample sample1 = new Sample();
        sample1.setSampleId(sampleId1);
        sample1.setSampleStatus(SampleStatus.RECEIVED);

        Sample sample2 = new Sample();
        sample2.setSampleId(sampleId2);
        sample2.setSampleStatus(SampleStatus.RECEIVED);

        when(sampleRepository.findById(sampleId1)).thenReturn(Optional.of(sample1));
        when(sampleRepository.findById(sampleId2)).thenReturn(Optional.of(sample2));
        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () -> {
            resultLocusService.createResultLocusAndDetail(sampleId1, sampleId2, appointmentId, new ResultLocusRequest());
        });

        assertEquals("APPOINTMENT_NOT_EXISTS", ex.getErrorCode().name());
    }


}
