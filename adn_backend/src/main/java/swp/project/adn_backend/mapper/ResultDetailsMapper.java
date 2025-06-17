package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.result.ResultDetailRequest;
import swp.project.adn_backend.dto.request.result.ResultLocusRequest;
import swp.project.adn_backend.dto.response.result.ResultDetailResponse;
import swp.project.adn_backend.dto.response.result.ResultLocusResponse;
import swp.project.adn_backend.entity.ResultDetail;
import swp.project.adn_backend.entity.ResultLocus;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ResultDetailsMapper {
    ResultDetail toResultDetail(ResultDetail resultDetail);

    ResultDetailResponse toResultDetailResponse(ResultDetail resultDetail);
}