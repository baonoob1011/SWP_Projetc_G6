package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;


import swp.project.adn_backend.dto.request.ManagerRequest;
import swp.project.adn_backend.dto.request.StaffRequest;
import swp.project.adn_backend.dto.request.UserRequest;
import swp.project.adn_backend.dto.response.serviceResponse.UserCreateServiceResponse;
import swp.project.adn_backend.entity.Users;

@Mapper(componentModel = "spring")
public interface UserMapper {
    Users toUser(UserRequest userDTO);

    Users toStaff(StaffRequest staffRequest);

    Users toManager(ManagerRequest managerRequest);
    UserCreateServiceResponse toUserCreateServiceResponse(Users users);
}
