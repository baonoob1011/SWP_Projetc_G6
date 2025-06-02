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
@RequestMapping("/api/register")
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

    @PostMapping("/user-account")
    public ResponseEntity<?> registerUserAccount(@RequestBody @Valid UserDTO userDTO) {

        Users user = userService.registerUserAccount(userDTO);
        return ResponseEntity.ok(user);

    }


    @PostMapping("/staff-account")
    public ResponseEntity<Staff> registerStaffAcount(@RequestBody @Valid StaffRequest staffRequest, Authentication authentication) {

        Staff staff = staffService.createStaff(staffRequest, authentication);
        return ResponseEntity.ok(staff);

    }

    @PostMapping("/manager-account")
    public ResponseEntity<Manager> registerManagerAccount(@RequestBody @Valid ManagerRequest managerRequest, Authentication authentication) {

        Manager manager = managerService.createManager(managerRequest, authentication);
        return ResponseEntity.ok(manager);

    }

}

