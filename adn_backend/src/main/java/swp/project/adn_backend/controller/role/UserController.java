package swp.project.adn_backend.controller.role;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.UserResponse;
import swp.project.adn_backend.dto.request.updateRequest.UpdateUserRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.AllAppointmentAtCenterResponse;
import swp.project.adn_backend.dto.response.role.UpdateUserResponse;
import swp.project.adn_backend.dto.response.slot.SlotResponse;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.Location.LocationService;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;
import swp.project.adn_backend.service.roleService.UserService;
import swp.project.adn_backend.service.slot.SlotService;

import java.util.List;


@RequestMapping("/api/user")
@FieldDefaults(level = AccessLevel.PRIVATE)
@RestController
public class UserController {

    UserService userService;
    AppointmentService appointmentService;
    SlotService slotService;
    LocationService locationService;

    @Autowired
    public UserController(UserService userService, AppointmentService appointmentService, SlotService slotService, LocationService locationService) {
        this.userService = userService;
        this.appointmentService = appointmentService;
        this.slotService = slotService;
        this.locationService = locationService;
    }

    @GetMapping("/get-user-info")
    public ResponseEntity<UserResponse> getUserInfo(Authentication authentication) {
        return ResponseEntity.ok(userService.getUserInfo(authentication));
    }

    @PutMapping("/update-user")
    public ResponseEntity<UpdateUserResponse> updateUser(Authentication authentication, @RequestBody @Valid UpdateUserRequest updateUserRequest) {
        return ResponseEntity.ok(userService.updateUser(authentication, updateUserRequest));
    }

}
