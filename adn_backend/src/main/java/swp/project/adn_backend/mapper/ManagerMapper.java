package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.ManagerRequest;
import swp.project.adn_backend.dto.request.StaffRequest;
import swp.project.adn_backend.entity.Manager;
import swp.project.adn_backend.entity.Staff;


@Mapper(componentModel = "spring")
public interface ManagerMapper {
    Manager toManager(ManagerRequest managerRequest);
}
