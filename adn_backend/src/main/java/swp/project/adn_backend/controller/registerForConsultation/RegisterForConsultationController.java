package swp.project.adn_backend.controller.registerForConsultation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.ConsultantInfoDTO;
import swp.project.adn_backend.dto.request.registerConsultation.RegisterConsultationRequest;
import swp.project.adn_backend.dto.response.registerConsultation.RegisterConsultationResponse;
import swp.project.adn_backend.service.registerForConsultation.RegisterForConsultationService;

import java.util.List;

@RestController
@RequestMapping("/api/register-for-consultation")
public class RegisterForConsultationController {
    @Autowired
    private RegisterForConsultationService registerForConsultationService;

    @PostMapping("/register-consultation")
    public ResponseEntity<RegisterConsultationResponse> getRegisterForConsultation(@RequestBody RegisterConsultationRequest registerConsultationRequest) {
        return ResponseEntity.ok(registerForConsultationService.createConsultation(registerConsultationRequest));
    }

    @GetMapping("/get-register-consultation")
    public ResponseEntity<List<ConsultantInfoDTO>> getAllConsultant() {
        return ResponseEntity.ok(registerForConsultationService.getAllConsultant());
    }

    @PutMapping("/update-register-consultation-status")
    public ResponseEntity<String> updateConsultantStatus(@RequestParam long registerForConsultationId,
                                                         @RequestBody RegisterConsultationRequest registerConsultationRequest) {
        registerForConsultationService.updateConsultantStatus(registerForConsultationId,registerConsultationRequest);
        return ResponseEntity.ok("Update Status Successful");
    }
}
