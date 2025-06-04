package swp.project.adn_backend.controller.authentication;

import jakarta.validation.Valid;
import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import swp.project.adn_backend.dto.request.ManagerRequest;
import swp.project.adn_backend.dto.request.StaffRequest;
import swp.project.adn_backend.dto.request.UserRequest;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.roleService.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/register")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterController {

    @Autowired
    UserService userService;

    @PostMapping("/user-account")
    public ResponseEntity<?> registerUserAccount(
            @RequestBody @Valid UserRequest userDTO,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        Users user = userService.registerUserAccount(userDTO);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/staff-account")
    public ResponseEntity<?> registerStaffAccount(
            @RequestBody @Valid StaffRequest staffRequest,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        Users user = userService.registerStaffAccount(staffRequest);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/manager-account")
    public ResponseEntity<?> registerManagerAccount(
            @RequestBody @Valid ManagerRequest managerRequest,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        Users user = userService.registerManagerAccount(managerRequest);
        return ResponseEntity.ok(user);
    }

}

