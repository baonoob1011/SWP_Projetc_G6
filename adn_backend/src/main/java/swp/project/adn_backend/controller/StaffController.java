package swp.project.adn_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.StaffRequest;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.StaffService;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    @Autowired
    private StaffService staffService;

    @GetMapping("/get-user-phone")
    public ResponseEntity<Users> getUserByPhone(@RequestParam String phone){
        return ResponseEntity.ok(staffService.findUserByPhone(phone));
    }
    @PutMapping("/update-profile")
    public ResponseEntity<Staff> updateStaffById(StaffRequest staffRequest, Authentication authentication){
        return ResponseEntity.ok(staffService.updateStaff(staffRequest,authentication));
    }

}
