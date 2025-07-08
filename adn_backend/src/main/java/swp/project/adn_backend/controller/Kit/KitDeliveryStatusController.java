package swp.project.adn_backend.controller.Kit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoByAppointmentDTO;
import swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.KitDeliveryStatusInfoStaffDTO;
import swp.project.adn_backend.dto.request.Kit.KitDeliveryStatusRequest;
import swp.project.adn_backend.dto.response.kit.KitDeliveryStatusResponse;
import swp.project.adn_backend.entity.KitDeliveryStatus;
import swp.project.adn_backend.service.Kit.KitDeliveryStatusService;

import java.util.List;

@RestController
@RequestMapping("/api/kit-delivery-status")
public class KitDeliveryStatusController {
    @Autowired
    private KitDeliveryStatusService kitDeliveryStatusService;

    @GetMapping("/get-kit-status-user")
    public ResponseEntity<List<KitDeliveryStatusInfoDTO>> getKitDeliveryStatusUser(Authentication authentication) {
        return ResponseEntity.ok(kitDeliveryStatusService.getKitDeliveryStatus(authentication));
    }
    @GetMapping("/get-kit-status-staff")
    public ResponseEntity<List<KitDeliveryStatusInfoStaffDTO>> getKitDeliveryStatusStaff(Authentication authentication) {
        return ResponseEntity.ok(kitDeliveryStatusService.getKitDeliveryStatusStaff(authentication));
    }

    @GetMapping("/get-kit-status-staff-by-appointment")
    public ResponseEntity<List<KitDeliveryStatusInfoByAppointmentDTO>> getKitDeliveryStatusByStaff(@RequestParam long appointmentId) {
        return ResponseEntity.ok(kitDeliveryStatusService.getKitDeliveryStatusByAppointment(appointmentId));
    }

    @PutMapping("/update-kit-status")
    public ResponseEntity<KitDeliveryStatusResponse> updateKitDeliveryStatus(@RequestBody KitDeliveryStatusRequest kitDeliveryStatusRequest,
                                                                             @RequestParam long appointmentId) {
        return ResponseEntity.ok(kitDeliveryStatusService.updateKitDeliveryStatus(kitDeliveryStatusRequest, appointmentId));
    }
}
