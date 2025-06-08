package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.roleRequest.ManagerRequest;
import swp.project.adn_backend.entity.Manager;

@Mapper(componentModel = "spring")
public interface ManagerMapper {
    Manager toManager(ManagerRequest managerRequest);
}
