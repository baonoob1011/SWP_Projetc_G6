package swp.project.adn_backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import swp.project.adn_backend.dto.GlobalRequest.CreateServiceRequest;
import swp.project.adn_backend.service.ServiceTestService;

@RestController
@RequestMapping("/api/services")
public class ServiceTestController {
    @Autowired
    private ServiceTestService serviceTestService;

    @PostMapping(value = "/create-administrative-service", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createAdministrativeService(
            @RequestPart("request") @Valid CreateServiceRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file,
            Authentication authentication) {

        serviceTestService.createAdministrativeService(
                request.getServiceRequest(),
                authentication,
                request.getPriceListRequest(),
                request.getAdministrativeServiceRequest(),
                file
        );

        return ResponseEntity.ok("Tạo dịch vụ ADN thành công");
    }



    @PostMapping(value = "/create-civil-service", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createCivilService(
            @RequestPart("request") @Valid CreateServiceRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file,
            Authentication authentication) {

        serviceTestService.createCivilService(
                request.getServiceRequest(),
                authentication,
                request.getPriceListRequest(),
                request.getCivilServiceRequest(),
                file
        );

        return ResponseEntity.ok("Tạo dịch vụ ADN thành công");
    }



}
