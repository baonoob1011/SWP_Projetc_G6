package swp.project.adn_backend.controller.role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO;

import swp.project.adn_backend.dto.InfoDTO.UserInfoDTO;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.roleService.ManagerService;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {
    @Autowired
    private ManagerService managerService;

    //Get
    @GetMapping("/get-all-user")
    public ResponseEntity<List<UserInfoDTO>> getAllUsers() {
        return ResponseEntity.ok(managerService.getAllUser());
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
    public void deleteStaffByPhone(@RequestParam long staffId) {
        managerService.deleteStaffByPhone(staffId);
    }

//    //update
//    @PutMapping("/update-profile")
//    public ResponseEntity<Users> updateStaffById(@RequestBody ManagerRequest managerRequest, Authentication authentication) {
//        return ResponseEntity.ok(managerService.updateManager(authentication, authentication));
//    }
}
