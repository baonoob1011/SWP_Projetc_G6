package swp.project.adn_backend.controller.Kit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoDTO;
import swp.project.adn_backend.entity.KitDeliveryStatus;
import swp.project.adn_backend.service.Kit.KitDeliveryStatusService;

import java.util.List;

@RestController
@RequestMapping("/api/kit-delivery-status")
public class KitDeliveryStatusController {
    @Autowired
    private KitDeliveryStatusService kitDeliveryStatusService;
    public ResponseEntity<List<KitDeliveryStatusInfoDTO>>getKitDeliveryStatusUser(Authentication authentication){
        return ResponseEntity.ok(kitDeliveryStatusService.getKitDeliveryStatus(authentication));
    }
}
