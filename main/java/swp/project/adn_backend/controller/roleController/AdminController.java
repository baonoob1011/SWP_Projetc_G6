package swp.project.adn_backend.controller.roleController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.UserInfoDTO;
import swp.project.adn_backend.dto.request.ManagerRequest;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.roleService.AdminService;
import swp.project.adn_backend.service.roleService.ManagerService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private ManagerService managerService;
    private AdminService adminService;

    @Autowired
    public AdminController(ManagerService managerService, AdminService adminService) {
        this.managerService = managerService;
        this.adminService = adminService;
    }

    //Get
    @GetMapping("/get-all-user")
    public ResponseEntity<List<UserInfoDTO>> getAllUsers() {
        return ResponseEntity.ok(managerService.getAllUser());
    }

    @GetMapping("/get-all-staff")
    public ResponseEntity<List<StaffInfoDTO>> getAllStaffs() {
        return ResponseEntity.ok(managerService.getAllStaff());
    }

    @GetMapping("/get-all-manager")
    public ResponseEntity<List<StaffInfoDTO>> getAllManager() {
        return ResponseEntity.ok(adminService.getAllManager());
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

    @DeleteMapping("/delete-manager")
    public void deleteManagerByPhone(@RequestParam String phone) {
        adminService.deleteManagerByPhone(phone);
    }

    //update
    @PutMapping("/update-profile")
    public ResponseEntity<Users> updateStaffById(@RequestBody ManagerRequest managerRequest, Authentication authentication) {
        return ResponseEntity.ok(managerService.updateManager(managerRequest, authentication));
    }
}
