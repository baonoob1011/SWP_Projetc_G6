package swp.project.adn_backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.GlobalRequest.CreateServiceRequest;
import swp.project.adn_backend.service.ServiceTestService;

@RestController
@RequestMapping("/api/services")
public class ServiceTestController {
    @Autowired
    private ServiceTestService serviceTestService;

    @PostMapping("/create-administrative-service")
    public ResponseEntity<String> createAdministrativeService(
            @RequestBody @Valid CreateServiceRequest request,
            Authentication authentication) {

        serviceTestService.createAdministrativeService(
                request.getServiceRequest(),
                authentication,
                request.getPriceListRequest(),
                request.getAdministrativeServiceRequest()

        );

        return ResponseEntity.ok("Tạo dịch vụ ADN thành công");
    }

    @PostMapping("/create-civil-service")
    public ResponseEntity<String> createCivilService(
            @RequestBody @Valid CreateServiceRequest request,
            Authentication authentication) {

        serviceTestService.createCivilService(
                request.getServiceRequest(),
                authentication,
                request.getPriceListRequest(),
                request.getCivilServiceRequest()

        );

        return ResponseEntity.ok("Tạo dịch vụ ADN thành công");
    }


}
