package swp.project.adn_backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import swp.project.adn_backend.dto.GlobalRequest.CreateServiceRequest;
import swp.project.adn_backend.service.authService.ServiceTestService;

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


}
