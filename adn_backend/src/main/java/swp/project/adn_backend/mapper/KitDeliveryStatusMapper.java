package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.Kit.KitRequest;
import swp.project.adn_backend.dto.request.Kit.UpdateKitRequest;
import swp.project.adn_backend.dto.response.kit.KitDeliveryStatusResponse;
import swp.project.adn_backend.dto.response.kit.KitStatusResponse;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.KitDeliveryStatus;

@Mapper(componentModel = "spring")
public interface KitDeliveryStatusMapper {
    KitDeliveryStatusResponse toKitDeliveryStatusResponse(KitDeliveryStatus kitDeliveryStatus);
}