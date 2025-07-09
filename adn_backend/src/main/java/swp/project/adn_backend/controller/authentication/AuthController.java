package swp.project.adn_backend.controller.authentication;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.service.Google.GoogleAuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private  GoogleAuthService googleAuthService;

    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> body) {
        String idToken = body.get("id_token");
        if (idToken == null || idToken.isBlank()) {
            return ResponseEntity.badRequest().body("idToken is required");
        }
        return googleAuthService.processGoogleLogin(idToken);
    }
}
