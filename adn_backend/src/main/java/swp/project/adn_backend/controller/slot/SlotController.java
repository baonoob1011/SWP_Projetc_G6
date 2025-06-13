package swp.project.adn_backend.controller.slot;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.SlotInfoDTO;
import swp.project.adn_backend.dto.response.slot.GetFullSlotResponse;
import swp.project.adn_backend.dto.request.slot.SlotRequest;
import swp.project.adn_backend.entity.Slot;
import swp.project.adn_backend.service.slot.SlotService;

import java.util.List;

@RestController
@RequestMapping("/api/slot")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SlotController {
    @Autowired
    SlotService slotService;

    @PostMapping("/create-slot/{staffId}")
    public ResponseEntity<Slot> staffId(@RequestBody @Valid SlotRequest slotRequest,
                                        @RequestParam long roomId,
                                        @PathVariable("staffId") long staffId) {
        return ResponseEntity.ok(slotService.createSlot(slotRequest,roomId , staffId));
    }

    @GetMapping("/get-all-slot")
    public ResponseEntity<List<GetFullSlotResponse>> getAllSlot() {
        return ResponseEntity.ok(slotService.getAllSlot());
    }

    @GetMapping("/get-all-slot-user")
    public ResponseEntity<List<SlotInfoDTO>> getAllSlotUser() {
        return ResponseEntity.ok(slotService.getALlSlotForUser());
    }

    @DeleteMapping("/delete-slot/{slotId}")
    public ResponseEntity<String> deleteSlot(@PathVariable("slotId") long slotId) {
        slotService.deleteSlot(slotId);
        return ResponseEntity.ok("Delete Successful");
    }

}
