package swp.project.adn_backend.controller.serviceController;

import jakarta.persistence.EntityManager;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import swp.project.adn_backend.dto.GlobalRequest.CreateServiceRequest;
import swp.project.adn_backend.dto.response.serviceResponse.ServiceResponse;
import swp.project.adn_backend.dto.test.FullServiceResponse;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.service.ServiceTestService;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceTestController {
    @Autowired
    private ServiceTestService serviceTestService;

    @PostMapping(value = "/create-service", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createAdministrativeService(
            @RequestPart("request") @Valid CreateServiceRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file,
            Authentication authentication) {

        serviceTestService.createService(
                request.getServiceRequest(),
                authentication,
                request.getPriceListRequest(),
                request.getAdministrativeServiceRequest(),
                request.getCivilServiceRequest(),
                file
        );
        return ResponseEntity.ok("Tạo dịch vụ ADN thành công");
    }

    @DeleteMapping("/delete-service")
    public ResponseEntity<ServiceTest> deleteService(@RequestParam long serviceId) {
        return ResponseEntity.ok(serviceTestService.deleteServiceTest(serviceId));
    }

    @GetMapping("/get-all-service")
    public ResponseEntity<List<ServiceResponse>>getAllService(){
        return ResponseEntity.ok(serviceTestService.getAllService());
    }
    @GetMapping("/get-all-administrative-service")
    public ResponseEntity<List<FullServiceResponse>> getAdministrativeServices() {
        List<FullServiceResponse> responses = serviceTestService.getAdministrativeServices();
        return ResponseEntity.ok(responses);
    }
    
}
