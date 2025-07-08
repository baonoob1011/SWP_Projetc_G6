package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;


import swp.project.adn_backend.dto.request.account.StaffAccountRequest;
import swp.project.adn_backend.dto.request.roleRequest.ManagerRequest;
import swp.project.adn_backend.dto.request.roleRequest.StaffRequest;
import swp.project.adn_backend.dto.request.roleRequest.UserRequest;
import swp.project.adn_backend.dto.response.role.UpdateUserResponse;
import swp.project.adn_backend.dto.response.serviceResponse.UserCreateServiceResponse;
import swp.project.adn_backend.entity.Users;

@Mapper(componentModel = "spring")
public interface UserMapper {
    Users toUser(UserRequest userDTO);
    Users toAccount(StaffAccountRequest staffAccountRequest);

    Users toStaff(StaffRequest staffRequest);

    Users toManager(ManagerRequest managerRequest);
    UserCreateServiceResponse toUserCreateServiceResponse(Users users);
    UpdateUserResponse toUpdateUserResponse(Users users);
}
