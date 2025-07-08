package swp.project.adn_backend.controller.sample;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.sample.SampleRequest;
import swp.project.adn_backend.dto.response.sample.AllSampleResponse;
import swp.project.adn_backend.dto.response.sample.SampleResponse;
import swp.project.adn_backend.service.sample.SampleService;

import java.util.List;

@RestController
@RequestMapping("/api/sample")
public class SampleController {
    @Autowired
    private SampleService sampleService;

    @PostMapping("/collect-sample-patient")
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

    @PostMapping("/collect-sample-patient-at-home")
    public ResponseEntity<SampleResponse> collectSampleAtHome(@RequestBody SampleRequest sampleRequest,
                                                        @RequestParam long patientId,
                                                        @RequestParam long serviceId,
                                                        @RequestParam long appointmentId,
                                                        Authentication authentication
    ) {
        return ResponseEntity.ok(sampleService.collectSampleAtHome(
                patientId,
                serviceId,
                appointmentId,
                sampleRequest,
                authentication
        ));

    }


// lấy sample ra xem theo đơn đăng kí
    @GetMapping("/get-all-sample")
    public ResponseEntity<List<AllSampleResponse>> getAllSample(Authentication authentication,
                                                                @RequestParam long appointmentId) {
        return ResponseEntity.ok(sampleService.getAllSampleOfPatient(authentication, appointmentId));
    }

    @PutMapping("/update-status-sample")
    public ResponseEntity<String> updateSampleStatus(@RequestBody SampleRequest sampleRequest,
                                                     @RequestParam long sampleId,
                                                     @RequestParam long appointmentId) {
        sampleService.updateSampleStatus(sampleId, appointmentId, sampleRequest);
        return ResponseEntity.ok("Update successful");
    }

    @DeleteMapping("/delete-sample")
    public ResponseEntity<String> deleteSample(@RequestParam long sampleId) {
        sampleService.deleteSample(sampleId);
        return ResponseEntity.ok("delete sample successful");
    }

}
