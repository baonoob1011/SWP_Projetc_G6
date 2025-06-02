package swp.project.adn_backend.controller;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.service.ManagerService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private ManagerService managerService;

    @DeleteMapping("/delete-user")
    public ResponseEntity<?> deleteUserByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(managerService.deleteUserByPhone(phone));
    }

}
