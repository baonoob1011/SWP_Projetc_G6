package swp.project.adn_backend.dto.request.slot;

import java.util.List;

public class AllSlotRequest {
    private SlotRequest slotRequest;
    private List<StaffSlotRequest> staffSlotRequest;

    public SlotRequest getSlotRequest() {
        return slotRequest;
    }

    public void setSlotRequest(SlotRequest slotRequest) {
        this.slotRequest = slotRequest;
    }

    public List<StaffSlotRequest> getStaffSlotRequest() {
        return staffSlotRequest;
    }

    public void setStaffSlotRequest(List<StaffSlotRequest> staffSlotRequest) {
        this.staffSlotRequest = staffSlotRequest;
    }
}
