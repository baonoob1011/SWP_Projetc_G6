package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import swp.project.adn_backend.dto.request.UserDTO;
import swp.project.adn_backend.entity.Users;
@Mapper(componentModel = "spring")
public interface UserMapper {
    Users toUser(UserDTO userDTO);
}
