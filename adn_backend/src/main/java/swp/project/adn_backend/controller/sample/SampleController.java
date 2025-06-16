package swp.project.adn_backend.controller.sample;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.sample.SampleRequest;
import swp.project.adn_backend.dto.response.sample.SampleResponse;
import swp.project.adn_backend.service.sample.SampleService;

@RestController
@RequestMapping("/api/sample")
public class SampleController {
    @Autowired
    private SampleService sampleService;

    @GetMapping("/collect-sample-patient")
    public ResponseEntity<SampleResponse> collectSample(@RequestBody SampleRequest sampleRequest,
                                                        @RequestParam long patientId,
                                                        @RequestParam long serviceId,
                                                        @RequestParam long appointmentId,
                                                        Authentication authentication
    ) {
        return ResponseEntity.ok(sampleService.collectSample(
                patientId,
                serviceId,
                appointmentId,
                sampleRequest,
                authentication
        ));

    }
}
