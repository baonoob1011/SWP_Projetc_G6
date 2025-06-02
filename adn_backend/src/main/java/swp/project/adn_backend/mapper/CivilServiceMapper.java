package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.AdministrativeServiceRequest;
import swp.project.adn_backend.dto.request.CivilServiceRequest;
import swp.project.adn_backend.entity.AdministrativeService;
import swp.project.adn_backend.entity.CivilService;


@Mapper(componentModel = "spring")
public interface CivilServiceMapper {
    CivilService toCivilService(CivilServiceRequest civilServiceRequest);
}