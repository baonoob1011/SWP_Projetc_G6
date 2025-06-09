package swp.project.adn_backend.controller.role;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.SlotInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.UserInfoDTO;
import swp.project.adn_backend.dto.request.updateRequest.UpdateStaffAndManagerRequest;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.service.roleService.StaffService;

import java.util.List;

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

    @GetMapping("/get-staff-slot")
    public ResponseEntity<List<SlotInfoDTO>> getSlotById(Authentication authentication) {
        return ResponseEntity.ok(staffService.getSlotByStaffId(authentication));
    }


    @PutMapping("/update-profile")
    public ResponseEntity<Users> updateStaffById(@RequestBody @Valid UpdateStaffAndManagerRequest staffRequest, Authentication authentication) {
        return ResponseEntity.ok(staffService.updateStaff(authentication, staffRequest));
    }


}
