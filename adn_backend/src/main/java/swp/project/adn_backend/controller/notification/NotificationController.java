package swp.project.adn_backend.controller.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.dto.InfoDTO.NotificationResponse;
import swp.project.adn_backend.service.notification.NotificationService;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/get-notification")
    public ResponseEntity<NotificationResponse> getNotification(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getNotification(authentication));
    }
}
