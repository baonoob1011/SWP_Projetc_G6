package swp.project.adn_backend.controller.role;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.Location.LocationResponse;
import swp.project.adn_backend.dto.request.updateRequest.UpdateUserRequest;
import swp.project.adn_backend.dto.response.appointment.AllAppointmentResponse;
import swp.project.adn_backend.dto.response.slot.SlotResponse;
import swp.project.adn_backend.entity.Location;
import swp.project.adn_backend.entity.Slot;
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

    @PutMapping("/update-user")
    public ResponseEntity<Users> updateUser(Authentication authentication, @RequestBody @Valid UpdateUserRequest updateUserRequest) {
        return ResponseEntity.ok(userService.updateUser(authentication, updateUserRequest));
    }
    @GetMapping("/get-appointment")
    public ResponseEntity<List<AllAppointmentResponse>> getAppointment(Authentication authentication){
        return ResponseEntity.ok(appointmentService.getAppointmentForUser(authentication));
    }
    @GetMapping("/get-all-slot")
    public ResponseEntity<List<SlotResponse>> getAllSlot(){
        return ResponseEntity.ok(slotService.getALlSlotForUser());
    }
}
