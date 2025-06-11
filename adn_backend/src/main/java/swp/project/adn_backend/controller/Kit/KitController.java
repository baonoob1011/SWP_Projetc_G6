package swp.project.adn_backend.controller.Kit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.Kit.KitRequest;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.service.Kit.KitService;

@RestController
@RequestMapping("/api/kit")
public class KitController {
    @Autowired
    private KitService kitService;

    @PostMapping("/create-kit/{serviceId}")
    public ResponseEntity<Kit> createKit(@RequestBody KitRequest kitRequest,
                                         @PathVariable("serviceId")long serviceId) {
        return ResponseEntity.ok(kitService.createKit(kitRequest,serviceId));
    }
}
