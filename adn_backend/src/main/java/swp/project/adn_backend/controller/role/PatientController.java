package swp.project.adn_backend.controller.role;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;
import swp.project.adn_backend.entity.Patient;
import swp.project.adn_backend.service.roleService.PatientService;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {
    @Autowired
    private PatientService patientService;

//    @PostMapping("/register-info")
//    public ResponseEntity<List<Patient>> registerInfoPatient(@RequestBody @Valid List<PatientRequest> patientRequest,
//                                                             Authentication authentication) {
//        return ResponseEntity.ok(patientService.registerServiceTest(patientRequest, authentication));
//    }
}
