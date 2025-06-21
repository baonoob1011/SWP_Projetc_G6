package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.Kit.KitRequest;
import swp.project.adn_backend.dto.request.Kit.UpdateKitRequest;
import swp.project.adn_backend.dto.request.result.LocusRequest;
import swp.project.adn_backend.dto.response.kit.KitStatusResponse;
import swp.project.adn_backend.dto.response.result.LocusResponse;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.Locus;

@Mapper(componentModel = "spring")
public interface LocusMapper {
Locus toLocus(LocusRequest locusRequest);
LocusResponse toLocusResponse(Locus locus);
}