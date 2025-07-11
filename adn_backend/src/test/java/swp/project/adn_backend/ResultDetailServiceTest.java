package swp.project.adn_backend;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import swp.project.adn_backend.dto.response.result.ResultDetailResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.*;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.ResultDetailsMapper;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.result.ResultDetailsService;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ResultDetailServiceTest {

    @InjectMocks
    private ResultDetailsService resultDetailService;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private ResultRepository resultRepository;

    @Mock
    private ResultDetailRepository resultDetailRepository;

    @Mock
    private ResultDetailsMapper resultDetailsMapper;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateResultDetail_success() {
        long appointmentId = 1L;

        // Prepare mock appointment
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(appointmentId);

        // Mock patients and samples
        Sample sample = new Sample();
        sample.setCollectionDate(LocalDate.of(2024, 1, 1));
        Patient patient = new Patient();
        patient.setSamples(List.of(sample));
        appointment.setPatients(List.of(patient));

        // Mock loci
        ResultLocus locus1 = new ResultLocus();
        locus1.setPi(10.0);
        ResultLocus locus2 = new ResultLocus();
        locus2.setPi(5.0);
        appointment.setResultLoci(List.of(locus1, locus2));

        ResultDetail resultDetail = new ResultDetail();
        ResultDetailResponse response = new ResultDetailResponse();

        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(resultRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(resultDetailRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(resultDetailsMapper.toResultDetailResponse(any())).thenReturn(response);

        // Act
        ResultDetailResponse result = resultDetailService.CreateResultDetail(appointmentId);

        // Assert
        assertNotNull(result);
        verify(resultRepository, times(1)).save(any());
        verify(resultDetailRepository, times(1)).save(any());
    }

    @Test
    void testCreateResultDetail_appointmentNotFound() {
        long appointmentId = 99L;

        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () ->
                resultDetailService.CreateResultDetail(appointmentId));
        assertEquals(ErrorCodeUser.SAMPLE_NOT_EXISTS, ex.getErrorCode());
    }

    @Test
    void testCreateResultDetail_noLociFound() {
        long appointmentId = 1L;

        Appointment appointment = new Appointment();
        appointment.setAppointmentId(appointmentId);
        appointment.setResultLoci(List.of()); // Empty loci

        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));

        AppException ex = assertThrows(AppException.class, () ->
                resultDetailService.CreateResultDetail(appointmentId));
        assertEquals(ErrorCodeUser.NO_RESULT_LOCUS_FOUND_FOR_SAMPLE, ex.getErrorCode());
    }
}
