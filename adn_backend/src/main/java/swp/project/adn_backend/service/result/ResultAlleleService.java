package swp.project.adn_backend.service.result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.result.ResultAlleleRequest;
import swp.project.adn_backend.dto.request.result.ResultRequest;
import swp.project.adn_backend.dto.response.result.ResultAlleleResponse;
import swp.project.adn_backend.dto.response.result.ResultResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.AlleleStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.ResultStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.ResultAlleleMapper;
import swp.project.adn_backend.mapper.ResultMapper;
import swp.project.adn_backend.repository.LocusRepository;
import swp.project.adn_backend.repository.ResultAlleleRepository;
import swp.project.adn_backend.repository.ResultRepository;
import swp.project.adn_backend.repository.SampleRepository;

@Service
public class ResultAlleleService {
    private ResultAlleleRepository resultAlleleRepository;
    private ResultAlleleMapper resultAlleleMapper;
    private SampleRepository sampleRepository;
    private LocusRepository locusRepository;

    @Autowired
    public ResultAlleleService(ResultAlleleRepository resultAlleleRepository, ResultAlleleMapper resultAlleleMapper, SampleRepository sampleRepository, LocusRepository locusRepository) {
        this.resultAlleleRepository = resultAlleleRepository;
        this.resultAlleleMapper = resultAlleleMapper;
        this.sampleRepository = sampleRepository;
        this.locusRepository = locusRepository;
    }

    public ResultAlleleResponse createAllele(ResultAlleleRequest resultAlleleRequest,
                                             long sampleId,
                                             long locusId) {

        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));
        Locus locus = locusRepository.findById(locusId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.LOCUS_NOT_EXISTS));
        ResultAllele resultAllele = resultAlleleMapper.toResultAllele(resultAlleleRequest);
        resultAllele.setLocus(locus);
        resultAllele.setSample(sample);
        resultAllele.setAlleleStatus(AlleleStatus.ENTERED);
        resultAlleleRepository.save(resultAllele);
        ResultAlleleResponse resultAlleleResponse = resultAlleleMapper.toResultAlleleResponse(resultAllele);
        return resultAlleleResponse;
    }
}
