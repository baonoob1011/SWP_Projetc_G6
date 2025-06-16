package swp.project.adn_backend.controller.Kit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.KitInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.KitStatusInfoDTO;
import swp.project.adn_backend.dto.request.Kit.KitRequest;
import swp.project.adn_backend.dto.request.Kit.UpdateKitRequest;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.service.Kit.KitService;

import java.util.List;

@RestController
@RequestMapping("/api/kit")
public class KitController {
    @Autowired
    private KitService kitService;

    @PostMapping("/create-kit")
    public ResponseEntity<Kit> createKit(@RequestBody KitRequest kitRequest) {
        return ResponseEntity.ok(kitService.createKit(kitRequest));
    }

    @GetMapping("/get-all-kit-staff")
    public ResponseEntity<List<KitInfoDTO>> getALlKit() {
        return ResponseEntity.ok(kitService.getAllKitForStaff());
    }

    @GetMapping("/view-kit-status-user")
    public ResponseEntity<List<KitStatusInfoDTO>> viewKitStatus() {
        return ResponseEntity.ok(kitService.getKitStatusForUser());
    }

    @PutMapping("/update-kit/{kitId}")
    public ResponseEntity<Kit> updateStatusByKitId(@PathVariable("kitId") long kitId,
                                                   UpdateKitRequest updateKitRequest) {
        return ResponseEntity.ok(kitService.updateStatusByKitId(kitId, updateKitRequest));
    }
}
