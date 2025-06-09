package swp.project.adn_backend.dto.request.slot;

public class GetFullSlotResponse {
    private SlotResponse slotResponse;
    private StaffSlotResponse staffSlotResponse;
//    private UserSlotResponse userSlotResponse;

    public GetFullSlotResponse() {
    }

    public GetFullSlotResponse(SlotResponse slotResponse, StaffSlotResponse staffSlotResponse) {
        this.slotResponse = slotResponse;
        this.staffSlotResponse = staffSlotResponse;
    }

    public SlotResponse getSlotResponse() {
        return slotResponse;
    }

    public void setSlotResponse(SlotResponse slotResponse) {
        this.slotResponse = slotResponse;
    }

    public StaffSlotResponse getStaffSlotResponse() {
        return staffSlotResponse;
    }

    public void setStaffSlotResponse(StaffSlotResponse staffSlotResponse) {
        this.staffSlotResponse = staffSlotResponse;
    }

//    public UserSlotResponse getUserSlotResponse() {
//        return userSlotResponse;
//    }
//
//    public void setUserSlotResponse(UserSlotResponse userSlotResponse) {
//        this.userSlotResponse = userSlotResponse;
//    }
}
