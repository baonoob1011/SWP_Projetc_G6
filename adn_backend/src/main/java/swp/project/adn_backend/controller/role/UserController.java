package swp.project.adn_backend.controller.role;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.UserRequest;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.roleService.UserService;

@RequestMapping("/api/user")
@FieldDefaults(level = AccessLevel.PRIVATE)
@RestController
public class UserController {
    @Autowired
    UserService userService;

    @PutMapping("/update-user")
    public ResponseEntity<Users> updateUser(Authentication authentication, UserRequest userDTO) {
        return ResponseEntity.ok(userService.updateUser(authentication, userDTO));
    }

}
