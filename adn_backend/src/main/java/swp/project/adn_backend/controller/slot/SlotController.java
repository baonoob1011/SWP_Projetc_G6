package swp.project.adn_backend.controller.slot;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.slot.SlotRequest;
import swp.project.adn_backend.entity.Slot;
import swp.project.adn_backend.service.slot.SlotService;

@RestController
@RequestMapping("/api/slot")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SlotController {
    @Autowired
    SlotService slotService;

    @PostMapping("/create-slot/{staffId}")
    public ResponseEntity<Slot>staffId(@RequestBody @Valid SlotRequest slotRequest,
                                          Authentication authentication,
                                          @PathVariable("staffId")Long staffId){
        return ResponseEntity.ok(slotService.createSlot(slotRequest,authentication,staffId));
    }
}
