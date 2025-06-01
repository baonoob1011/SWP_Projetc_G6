package swp.project.adn_backend.controller;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.configuration.SecurityConfig;
import swp.project.adn_backend.dto.request.UserDTO;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.UserService;

import java.util.List;

@RequestMapping("/api/user")
@FieldDefaults(level = AccessLevel.PRIVATE)
@RestController
public class UserController {
    @Autowired
    UserService userService;

    @PutMapping("/update-user")
    public ResponseEntity<Users> updateUser(Authentication authentication, UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(authentication, userDTO));
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<Users> deleteUser(Authentication authentication, UserDTO userDTO) {
        return ResponseEntity.ok(userService.deleteUser(authentication, userDTO));
    }
}
