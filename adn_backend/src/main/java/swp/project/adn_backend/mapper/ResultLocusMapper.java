package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.Kit.KitRequest;
import swp.project.adn_backend.dto.request.Kit.UpdateKitRequest;
import swp.project.adn_backend.dto.request.result.ResultLocusRequest;
import swp.project.adn_backend.dto.response.result.ResultLocusResponse;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.ResultLocus;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ResultLocusMapper {
    List<ResultLocus> toResultLocus(List<ResultLocusRequest> resultLocusRequest);

    ResultLocusResponse toResultLocusResponse(ResultLocus resultLocus);
}