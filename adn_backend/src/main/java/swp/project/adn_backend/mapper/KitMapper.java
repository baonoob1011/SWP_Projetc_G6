package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.Kit.KitRequest;
import swp.project.adn_backend.dto.request.Kit.UpdateKitRequest;
import swp.project.adn_backend.entity.Kit;

@Mapper(componentModel = "spring")
public interface KitMapper {
    Kit toKit(KitRequest kitRequest);
    Kit toUpdateKit(UpdateKitRequest updateKitRequest);
}