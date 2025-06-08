package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.serviceRequest.AdministrativeServiceRequest;
import swp.project.adn_backend.entity.AdministrativeService;

@Mapper(componentModel = "spring")
public interface AdministrativeMapper {
    AdministrativeService toAdministrativeService(AdministrativeServiceRequest administrativeRequest);
}