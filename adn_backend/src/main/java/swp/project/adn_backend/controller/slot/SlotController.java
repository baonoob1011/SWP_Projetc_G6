package swp.project.adn_backend.controller.slot;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.SlotInfoDTO;
import swp.project.adn_backend.dto.request.slot.AllSlotRequest;
import swp.project.adn_backend.dto.response.slot.GetFullSlotResponse;
import swp.project.adn_backend.dto.request.slot.SlotRequest;
import swp.project.adn_backend.dto.response.slot.SlotResponse;
import swp.project.adn_backend.entity.Slot;
import swp.project.adn_backend.service.slot.SlotService;

import java.util.List;

@RestController
@RequestMapping("/api/slot")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SlotController {
    @Autowired
    SlotService slotService;

    @PostMapping("/create-slot")
    public ResponseEntity<List<SlotResponse>> createSlot(@RequestBody @Valid AllSlotRequest request,
                                                         @RequestParam long roomId
    ) {

        return ResponseEntity.ok(slotService.createSlot(request.getSlotRequest(),
                roomId,
                request.getStaffSlotRequest()));
    }

    @GetMapping("/get-all-slot")
    public ResponseEntity<List<GetFullSlotResponse>> getAllSlot( ) {
        return ResponseEntity.ok(slotService.getAllSlot());
    }
     @GetMapping("/get-all-slot-staff-collector")
        public ResponseEntity<List<GetFullSlotResponse>> getAllSlotStaff( Authentication authentication) {
            return ResponseEntity.ok(slotService.getAllSlotStaff(authentication));
     }

    @GetMapping("/get-all-slot-of-staff")
    public ResponseEntity<List<GetFullSlotResponse>> getAllSlotOfStaff(Authentication authentication) {
        return ResponseEntity.ok(slotService.getAllSlotOfStaff(authentication));
    }

    @GetMapping("/get-all-slot-user")
    public ResponseEntity<List<SlotInfoDTO>> getAllSlotUser(@RequestParam long locationId) {
        return ResponseEntity.ok(slotService.getAllUpcomingSlotsForUser(locationId));
    }

    @DeleteMapping("/delete-slot/{slotId}")
    public ResponseEntity<String> deleteSlot(@PathVariable("slotId") long slotId) {
        slotService.deleteSlot(slotId);
        return ResponseEntity.ok("Delete Successful");
    }

    @PutMapping("/update-staff-to-slot")
    public ResponseEntity<String> updateStaffToSlot(@RequestParam long staffId1,
                                                    @RequestParam long staffId2,
                                                    @RequestParam long slotId) {
        slotService.updateStaffToSlot(staffId1, staffId2, slotId);
        return ResponseEntity.ok("Update Staff to Slot Successful");
    }

    @PutMapping("/update-slot")
    public ResponseEntity<SlotResponse> updateSlot(@RequestBody SlotRequest slotRequest,
                                                   @RequestParam long slotId) {

        return ResponseEntity.ok(slotService.updateSlot(slotRequest, slotId));
    }

    @PutMapping("/add-more-staff-to-slot")
    public ResponseEntity<String> addMoreStaffToSlot(@RequestParam long staffId,
                                                     @RequestParam long slotId) {
        slotService.addMoreStaffToSlot(slotId, staffId);
        return ResponseEntity.ok("Thêm staff thành công");
    }

//    @PutMapping("/update-order-staff")
//    public ResponseEntity<Slot> updateOrderStaff(@RequestParam long staffId,
//                                                 @RequestParam long slotId) {
//        return ResponseEntity.ok(slotService.updateSlotForStaffId(staffId, slotId));
//    }

}
