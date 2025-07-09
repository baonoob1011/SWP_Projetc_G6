package swp.project.adn_backend.service.Google;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.repository.UserRepository;
import swp.project.adn_backend.service.JWT.AuthenticationUserService;

import java.util.*;

@Service
public class GoogleAuthService {

    private  UserRepository userRepository;
    private    AuthenticationUserService authenticationUserService;
    private final String GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";

    @Autowired
    public GoogleAuthService(UserRepository userRepository, AuthenticationUserService authenticationUserService) {
        this.userRepository = userRepository;
        this.authenticationUserService = authenticationUserService;
    }

    public ResponseEntity<?> processGoogleLogin(String idToken) {
        try {
            // Gửi id_token tới Google để xác thực
            RestTemplate restTemplate = new RestTemplate();
            String verifyUrl = GOOGLE_TOKEN_INFO_URL + idToken;

            String json = restTemplate.getForObject(verifyUrl, String.class);
            JSONObject payload = new JSONObject(json);

            // Trích xuất thông tin người dùng
            String email = payload.getString("email");
            String name = payload.optString("name", "Unknown");

            // Tìm hoặc tạo người dùng mới
            Users user = userRepository.findByEmail(email).orElseGet(() -> {
                Users newUser = new Users();
                newUser.setEmail(email);
                newUser.setFullName(name);
                newUser.setRoles(Set.of(Roles.USER.name()));
                return userRepository.save(newUser);
            });

            // Sinh JWT nội bộ
            String jwt = authenticationUserService.generateToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", Map.of(
                    "email", user.getEmail(),
                    "name", user.getFullName(),
                    "roles", user.getRoles()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error verifying token: " + e.getMessage());
        }
    }
}
