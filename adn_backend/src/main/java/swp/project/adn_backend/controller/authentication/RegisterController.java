package swp.project.adn_backend.controller.authentication;

import jakarta.validation.Valid;
import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import swp.project.adn_backend.dto.InfoDTO.UserResponse;
import swp.project.adn_backend.dto.request.account.StaffAccountRequest;
import swp.project.adn_backend.dto.request.roleRequest.ManagerRequest;
import swp.project.adn_backend.dto.request.roleRequest.StaffRequest;
import swp.project.adn_backend.dto.request.roleRequest.UserRequest;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.roleService.UserService;

import java.util.HashMap;
import java.util.List;
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
    @PostMapping("/staff-account-auto")
    public ResponseEntity<?> registerAccount(
            @RequestBody StaffAccountRequest userDTO,
            Authentication authentication,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        Users user = userService.registerAccount(userDTO,authentication);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/staff-account")
    public ResponseEntity<?> registerStaffAccount(
            @RequestBody  StaffRequest staffRequest,
            BindingResult bindingResult,
            Authentication authentication) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        Users user = userService.registerStaffAccount(staffRequest,authentication);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/staff-collector-account")
    public ResponseEntity<?> registerStaffCollectorAccount(
            @RequestBody  StaffRequest staffRequest,
            BindingResult bindingResult,
            Authentication authentication) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        Users user = userService.registerStaffCollectorSampleAccount(staffRequest, authentication);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/staff-cashier-account")
    public ResponseEntity<?> registerStaffCollectorSampleAccount(
            @RequestBody  StaffRequest staffRequest,
            BindingResult bindingResult,
            Authentication authentication) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        Users user = userService.registerCashierAccount(staffRequest, authentication);
        return ResponseEntity.ok(user);
    }


    @PostMapping("/staff-at-home-account")
    public ResponseEntity<?> registerStaffShippingAccount(
            @RequestBody  StaffRequest staffRequest,
            BindingResult bindingResult,
            Authentication authentication) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        Users user = userService.registerStaffAtHomeAccount(staffRequest, authentication);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/lab-technician-account")
    public ResponseEntity<?> registerLabTechnicianAccount(
            @RequestBody  StaffRequest staffRequest,
            BindingResult bindingResult,
            Authentication authentication) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        Users user = userService.registerLabTechnicianAccount(staffRequest, authentication);
        return ResponseEntity.ok(user);
    }
    @PostMapping("/consultant-account")
    public ResponseEntity<?> registerConsultantAccount(
            @RequestBody  StaffRequest staffRequest,
            BindingResult bindingResult,
            Authentication authentication) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        Users user = userService.registerConsultantAccount(staffRequest, authentication);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/manager-account")
    public ResponseEntity<?> registerManagerAccount(
            @RequestBody  ManagerRequest managerRequest,
            BindingResult bindingResult,
            Authentication authentication) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        Users user = userService.registerManagerAccount(managerRequest,authentication);
        return ResponseEntity.ok(user);
    }

}

