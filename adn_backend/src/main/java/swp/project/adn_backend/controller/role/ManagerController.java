package swp.project.adn_backend.controller.role;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO;

import swp.project.adn_backend.dto.request.ManagerRequest;
import swp.project.adn_backend.dto.request.UpdateRequest.UpdateUserRequest;
import swp.project.adn_backend.entity.Manager;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.roleService.ManagerService;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {
    @Autowired
    private ManagerService managerService;

    @PutMapping("/update-profile")
    public ResponseEntity<Manager> updateStaffById(@RequestBody @Valid UpdateUserRequest updateUserRequest, Authentication authentication) {
        return ResponseEntity.ok(managerService.updateManagerById(authentication, updateUserRequest));
    }

    @GetMapping("/get-all-staff")
    public ResponseEntity<List<StaffInfoDTO>> getAllStaffs() {
        return ResponseEntity.ok(managerService.getAllStaff());
    }


    @GetMapping("/get-user-phone")
    public ResponseEntity<Users> getUserByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(managerService.findUserByPhone(phone));
    }

    //delete
    @DeleteMapping("/delete-user")
    public void deleteUserByPhone(@RequestParam String phone) {
        managerService.deleteUserByPhone(phone);
    }

    @DeleteMapping("/delete-staff")
    public void deleteStaffByPhone(@RequestParam String phone) {
        managerService.deleteStaffByPhone(phone);
    }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
//    //update
//    @PutMapping("/update-profile")
//    public ResponseEntity<Users> updateStaffById(@RequestBody ManagerRequest managerRequest, Authentication authentication) {
//        return ResponseEntity.ok(managerService.updateManager(authentication, authentication));
//    }
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}
