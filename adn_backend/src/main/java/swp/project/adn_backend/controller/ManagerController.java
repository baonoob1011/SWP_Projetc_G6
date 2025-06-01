package swp.project.adn_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.ManagerService;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {
    @Autowired
    private ManagerService managerService;

    @GetMapping("/get-all-user")
    public ResponseEntity<List<Users>> getAllUsers() {
        return ResponseEntity.ok(managerService.getAllUser());
    }

    @GetMapping("/get-all-staff")
    public ResponseEntity<List<Staff>> getAllStaffs() {
        return ResponseEntity.ok(managerService.getAllStaff());
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<Users> deleteUserByPhone(@RequestBody String phone) {
        return ResponseEntity.ok(managerService.deleteUserByPhone(phone));
    }

    @DeleteMapping("/delete-staff")
    public ResponseEntity<Staff> deleteStaffByPhone(@RequestBody String phone) {
        return ResponseEntity.ok(managerService.deleteStaffByPhone(phone));
    }

}
