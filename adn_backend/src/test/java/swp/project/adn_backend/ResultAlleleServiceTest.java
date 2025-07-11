package swp.project.adn_backend;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import swp.project.adn_backend.dto.request.result.AllelePairRequest;
import swp.project.adn_backend.dto.response.result.ResultAlleleResponse;
import swp.project.adn_backend.entity.Locus;
import swp.project.adn_backend.entity.ResultAllele;
import swp.project.adn_backend.entity.Sample;
import swp.project.adn_backend.enums.AlleleStatus;
import swp.project.adn_backend.enums.SampleStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.ResultAlleleMapper;
import swp.project.adn_backend.repository.LocusRepository;
import swp.project.adn_backend.repository.ResultAlleleRepository;
import swp.project.adn_backend.repository.SampleRepository;
import swp.project.adn_backend.service.result.ResultAlleleService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ResultAlleleServiceTest {

    @InjectMocks
    private ResultAlleleService resultAlleleService;  // ✅ Đúng service


    @Mock
    private SampleRepository sampleRepository;

    @Mock
    private LocusRepository locusRepository;

    @Mock
    private ResultAlleleRepository resultAlleleRepository;

    @Mock
    private ResultAlleleMapper resultAlleleMapper;

    @Test
    void testCreateAllelePair_success() {
        long sampleId = 1L;
        long locusId = 2L;

        Sample sample = new Sample();
        sample.setSampleId(sampleId);
        sample.setSampleStatus(SampleStatus.RECEIVED);

        Locus locus = new Locus();
        locus.setLocusId(locusId);

        AllelePairRequest request = new AllelePairRequest();
        request.setAllele1(12);
        request.setAllele2(14);
        request.setAlleleStatus(AlleleStatus.VALID);

        ResultAllele allele1 = new ResultAllele();
        ResultAllele allele2 = new ResultAllele();

        ResultAlleleResponse response1 = new ResultAlleleResponse();
        ResultAlleleResponse response2 = new ResultAlleleResponse();

        when(sampleRepository.findById(sampleId)).thenReturn(Optional.of(sample));
        when(locusRepository.findById(locusId)).thenReturn(Optional.of(locus));
        when(resultAlleleRepository.save(any())).thenReturn(allele1).thenReturn(allele2);
        when(resultAlleleMapper.toResultAlleleResponse(any())).thenReturn(response1).thenReturn(response2);
        when(resultAlleleRepository.countBySample_SampleIdAndAlleleStatus(sampleId, AlleleStatus.INVALID)).thenReturn(2);

        List<ResultAlleleResponse> result = resultAlleleService.createAllelePair(request, sampleId, locusId);

        assertEquals(2, result.size());
        verify(resultAlleleRepository, times(2)).save(any());
        assertEquals(SampleStatus.RECEIVED, sample.getSampleStatus());
    }
    @Test
    void testCreateAllelePair_sampleNotFound() {
        long sampleId = 99L;
        long locusId = 2L;

        when(sampleRepository.findById(sampleId)).thenReturn(Optional.empty());

        AllelePairRequest request = new AllelePairRequest();
        request.setAllele1(12);
        request.setAllele2(14);
        request.setAlleleStatus(AlleleStatus.VALID);

        assertThrows(AppException.class, () ->
                resultAlleleService.createAllelePair(request, sampleId, locusId));
    }
    @Test
    void testCreateAllelePair_sampleRejected() {
        long sampleId = 1L;
        long locusId = 2L;

        Sample sample = new Sample();
        sample.setSampleStatus(SampleStatus.REJECTED);

        when(sampleRepository.findById(sampleId)).thenReturn(Optional.of(sample));

        AllelePairRequest request = new AllelePairRequest();
        request.setAllele1(12);
        request.setAllele2(14);
        request.setAlleleStatus(AlleleStatus.INVALID);

        assertThrows(RuntimeException.class, () ->
                resultAlleleService.createAllelePair(request, sampleId, locusId));
    }
    @Test
    void testCreateAllelePair_locusNotFound() {
        long sampleId = 1L;
        long locusId = 99L;

        Sample sample = new Sample();
        sample.setSampleStatus(SampleStatus.RECEIVED);

        when(sampleRepository.findById(sampleId)).thenReturn(Optional.of(sample));
        when(locusRepository.findById(locusId)).thenReturn(Optional.empty());

        AllelePairRequest request = new AllelePairRequest();
        request.setAllele1(12);
        request.setAllele2(14);
        request.setAlleleStatus(AlleleStatus.VALID);

        assertThrows(AppException.class, () ->
                resultAlleleService.createAllelePair(request, sampleId, locusId));
    }
    @Test
    void testCreateAllelePair_markSampleAsRejected() {
        long sampleId = 1L;
        long locusId = 2L;

        Sample sample = new Sample();
        sample.setSampleStatus(SampleStatus.RECEIVED);

        Locus locus = new Locus();

        AllelePairRequest request = new AllelePairRequest();
        request.setAllele1(15);
        request.setAllele2(15);
        request.setAlleleStatus(AlleleStatus.INVALID); // để count là 3

        ResultAllele allele1 = new ResultAllele();
        ResultAllele allele2 = new ResultAllele();

        when(sampleRepository.findById(sampleId)).thenReturn(Optional.of(sample));
        when(locusRepository.findById(locusId)).thenReturn(Optional.of(locus));
        when(resultAlleleRepository.save(any())).thenReturn(allele1).thenReturn(allele2);
        when(resultAlleleMapper.toResultAlleleResponse(any())).thenReturn(new ResultAlleleResponse());
        when(resultAlleleRepository.countBySample_SampleIdAndAlleleStatus(sampleId, AlleleStatus.INVALID)).thenReturn(3); // >= 3

        resultAlleleService.createAllelePair(request, sampleId, locusId);

        assertEquals(SampleStatus.REJECTED, sample.getSampleStatus()); // ✅ đã bị từ chối
    }

}
