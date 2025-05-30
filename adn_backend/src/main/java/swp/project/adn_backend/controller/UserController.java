package swp.project.adn_backend.controller;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.configuration.SecurityConfig;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.UserService;

import java.util.List;

@RequestMapping("/getUsers")
@FieldDefaults(level = AccessLevel.PRIVATE)
@RestController
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    UserService userService;

    @GetMapping
    public List<Users> getAllUsers(){
        var authentication= SecurityContextHolder.getContext().getAuthentication();
        log.info("Username : {}",authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));
      return userService.getAllUsers();
    }
}
