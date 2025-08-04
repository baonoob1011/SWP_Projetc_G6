package swp.project.adn_backend.service.result;

import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.result.ResultRequest;
import swp.project.adn_backend.dto.response.result.ResultResponse;
import swp.project.adn_backend.entity.Result;
import swp.project.adn_backend.entity.Sample;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.ResultStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.ResultMapper;
import swp.project.adn_backend.repository.ResultRepository;
import swp.project.adn_backend.repository.SampleRepository;

@Service
public class ResultService {
    private ResultMapper resultMapper;
    private ResultRepository resultRepository;
    private SampleRepository sampleRepository;

    public ResultResponse createResult(ResultRequest resultRequest,
                                       long sampleId){
        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));
        Result result=resultMapper.toResult(resultRequest);
        result.setCollectionDate(sample.getCollectionDate());
        result.setResultStatus(ResultStatus.IN_PROGRESS);
        ResultResponse resultResponse=resultMapper.toResultResponse(result);
        return resultResponse;
    }
    //thực update status result
}
