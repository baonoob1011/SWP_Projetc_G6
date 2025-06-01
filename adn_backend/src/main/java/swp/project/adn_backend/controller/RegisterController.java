package swp.project.adn_backend.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import swp.project.adn_backend.dto.request.ManagerRequest;
import swp.project.adn_backend.dto.request.StaffRequest;
import swp.project.adn_backend.dto.request.UserDTO;
import swp.project.adn_backend.dto.response.APIResponse;
import swp.project.adn_backend.dto.response.ErrorResponse;
import swp.project.adn_backend.entity.Manager;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.service.ManagerService;
import swp.project.adn_backend.service.StaffService;
import swp.project.adn_backend.service.UserService;

@RestController
@RequestMapping("/api")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterController {

    UserService userService;
    StaffService staffService;
    ManagerService managerService;

    @Autowired
    public RegisterController(UserService userService, StaffService staffService, ManagerService managerService) {
        this.userService = userService;
        this.staffService = staffService;
        this.managerService = managerService;
    }

    @PostMapping("/register/user-account")
    public ResponseEntity<?> registerUserAccount(@RequestBody @Valid UserDTO userDTO) {
        try {
            Users user = userService.registerUserAccount(userDTO);
            return ResponseEntity.ok(user);
        } catch (AppException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(ex.getErrorCode(), ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(ErrorCodeUser.INTERNAL_ERROR,"Unexpected error occurred."));
        }
    }


    @PostMapping("/register/staff-account")
    public ResponseEntity<?> registerStaffAcount(@RequestBody @Valid StaffRequest staffRequest, Authentication authentication) {
        try {
            Staff staff = staffService.createStaff(staffRequest, authentication);
            return ResponseEntity.ok(staff);
        } catch (AppException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(ex.getErrorCode(), ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(ErrorCodeUser.INTERNAL_ERROR, "Unexpected error occurred."));
        }
    }

    @PostMapping("/register/manager-account")
    public ResponseEntity<?> registerManagerAccount(@RequestBody @Valid ManagerRequest managerRequest, Authentication authentication) {
        try {
            Manager manager = managerService.createManager(managerRequest, authentication);
            return ResponseEntity.ok(manager);
        } catch (AppException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(ex.getErrorCode(), ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(ErrorCodeUser.INTERNAL_ERROR, "Unexpected error occurred."));
        }
    }

}

