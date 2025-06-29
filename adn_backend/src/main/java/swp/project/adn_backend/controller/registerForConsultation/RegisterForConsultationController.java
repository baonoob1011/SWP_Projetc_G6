package swp.project.adn_backend.controller.registerForConsultation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.dto.request.registerConsultation.RegisterConsultationRequest;
import swp.project.adn_backend.dto.response.registerConsultation.RegisterConsultationResponse;
import swp.project.adn_backend.service.registerForConsultation.RegisterForConsultationService;

@RestController
@RequestMapping("/api/register-for-consultation")
public class RegisterForConsultationController {
    @Autowired
    private RegisterForConsultationService registerForConsultationService;

    @PostMapping("/register-consultation")
    public ResponseEntity<RegisterConsultationResponse> getRegisterForConsultation(RegisterConsultationRequest registerConsultationRequest) {
        return ResponseEntity.ok(registerForConsultationService.createConsultation(registerConsultationRequest));
    }
}
