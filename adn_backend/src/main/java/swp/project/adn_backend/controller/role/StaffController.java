package swp.project.adn_backend.controller.role;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.UserInfoDTO;
import swp.project.adn_backend.dto.request.StaffRequest;
<<<<<<< Updated upstream
import swp.project.adn_backend.dto.request.updateRequest.UpdateStaffAndManagerRequest;
=======
import swp.project.adn_backend.dto.request.UpdateRequest.UpdateUserRequest;
>>>>>>> Stashed changes
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.roleService.StaffService;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    @Autowired
    private StaffService staffService;

    //get
    @GetMapping("/get-user-phone")
    public ResponseEntity<UserInfoDTO> getUserByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(staffService.findUserByPhone(phone));
    }

    @PutMapping("/update-profile")
<<<<<<< Updated upstream
    public ResponseEntity<Users> updateStaffById(@RequestBody @Valid UpdateStaffAndManagerRequest staffRequest, Authentication authentication) {
        return ResponseEntity.ok(staffService.updateStaff(authentication, staffRequest));
=======
    public ResponseEntity<Staff> updateStaffById(@RequestBody @Valid UpdateUserRequest updateUserRequest, Authentication authentication) {
        return ResponseEntity.ok(staffService.updateStaffById(authentication, updateUserRequest));
>>>>>>> Stashed changes
    }

}
