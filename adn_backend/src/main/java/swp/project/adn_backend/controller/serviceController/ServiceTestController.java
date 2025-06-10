package swp.project.adn_backend.controller.serviceController;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import swp.project.adn_backend.dto.GlobalRequest.CreateServiceRequest;
import swp.project.adn_backend.dto.response.serviceResponse.FullCivilServiceResponse;
import swp.project.adn_backend.dto.response.serviceResponse.FullServiceTestResponse;
import swp.project.adn_backend.dto.response.serviceResponse.FullAdministrationServiceResponse;
import swp.project.adn_backend.service.registerServiceTestService.ServiceTestService;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceTestController {
    @Autowired
    private ServiceTestService serviceTestService;

    @PostMapping(value = "/create-service", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createService(
            @RequestPart("request") @Valid CreateServiceRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file,
            Authentication authentication) {

        serviceTestService.createService(
                request.getServiceRequest(),
                authentication,
                request.getPriceListRequest(),
                file
        );
        return ResponseEntity.ok("Tạo dịch vụ ADN thành công");
    }

    @PutMapping(value = "/update-service/{serviceId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateServiceTest(
            @RequestPart("request") @Valid CreateServiceRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @PathVariable long serviceId,
            Authentication authentication) {

        serviceTestService.updateService(
                serviceId,
                request.getUpdateServiceTestRequest(),
                authentication,
                request.getPriceListRequest(),
                file
        );
        return ResponseEntity.ok("edit dịch vụ ADN thành công");
    }

    @DeleteMapping("/delete-service/{serviceId}")
    public ResponseEntity<String> deleteService(@PathVariable("serviceId") long serviceId) {
        serviceTestService.deleteServiceTest(serviceId);
        return ResponseEntity.ok("Delete Successful");
    }

    @GetMapping("/get-all-service")
    public ResponseEntity<List<FullServiceTestResponse>> getAllService() {
        return ResponseEntity.ok(serviceTestService.getAllService());
    }

    @GetMapping("/get-all-administrative-service")
    public ResponseEntity<List<FullAdministrationServiceResponse>> getAdministrativeServices() {
        List<FullAdministrationServiceResponse> responses = serviceTestService.getAdministrativeServices();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/get-all-civil-service")
    public ResponseEntity<List<FullCivilServiceResponse>> getCivilServices() {
        List<FullCivilServiceResponse> responses = serviceTestService.getCivilServices();
        return ResponseEntity.ok(responses);
    }

}
