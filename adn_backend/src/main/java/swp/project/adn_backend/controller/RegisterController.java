package swp.project.adn_backend.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import swp.project.adn_backend.dto.request.UserDTO;
import swp.project.adn_backend.dto.response.APIResponse;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.UserService;

@RestController
@RequestMapping("/api")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterController {
    @Autowired
    UserService userService;
    @PostMapping("/register")
    public APIResponse<Users> register(@RequestBody @Valid UserDTO userDTO) {
        APIResponse<Users> usersAPIResponse=new APIResponse<>();
        usersAPIResponse.setResult(userService.registerUserAccount(userDTO));
        return  usersAPIResponse;
    }
}

