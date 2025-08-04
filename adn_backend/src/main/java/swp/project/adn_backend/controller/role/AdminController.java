package swp.project.adn_backend.controller.role;


import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.ManagerInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.UserInfoDTO;
import swp.project.adn_backend.dto.request.updateRequest.UpdateStaffAndManagerRequest;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.roleService.AdminService;
import swp.project.adn_backend.service.roleService.ManagerService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);
    private ManagerService managerService;
    private AdminService adminService;

    @Autowired
    public AdminController(ManagerService managerService, AdminService adminService) {
        this.managerService = managerService;
        this.adminService = adminService;
    }

    //Get
    @GetMapping("/get-all-user")
    ResponseEntity<List<UserInfoDTO>> getAllUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        System.out.println("Username: {}" + authentication.getName());
        System.out.println("Roles: {}" + authentication.getAuthorities());
        authentication.getAuthorities().forEach(grantedAuthority ->
                System.out.println(grantedAuthority.getAuthority())
        );

        return ResponseEntity.ok(managerService.getAllUser());
    }

    @GetMapping("/get-all-staff")
    public ResponseEntity<List<StaffInfoDTO>> getAllStaffs() {
        return ResponseEntity.ok(managerService.getAllStaff());
    }

    @GetMapping("/get-all-manager")
    public ResponseEntity<List<ManagerInfoDTO>> getAllManager() {
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
    public void deleteStaffByPhone(@RequestParam long staffId) {
        managerService.deleteStaffByPhone(staffId);
    }

    @DeleteMapping("/delete-manager")
    public void deleteManagerByPhone(@RequestParam String phone) {
        adminService.deleteManagerByPhone(phone);
    }

    //update
    @PutMapping("/update-profile")
    public ResponseEntity<Users> updateStaffById(@RequestBody @Valid UpdateStaffAndManagerRequest updateStaffAndManagerRequest, Authentication authentication) {
        return ResponseEntity.ok(managerService.updateManager(authentication, updateStaffAndManagerRequest));
    }
}
