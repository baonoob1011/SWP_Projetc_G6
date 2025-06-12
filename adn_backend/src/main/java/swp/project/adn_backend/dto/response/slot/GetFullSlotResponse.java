package swp.project.adn_backend.dto.response.slot;

public class GetFullSlotResponse {
    private SlotResponse slotResponse;
    private StaffSlotResponse staffSlotResponse;
    private RoomSlotResponse roomSlotResponse;
//    private UserSlotResponse userSlotResponse;

    public GetFullSlotResponse() {
    }

    public GetFullSlotResponse(SlotResponse slotResponse, StaffSlotResponse staffSlotResponse, RoomSlotResponse roomSlotResponse) {
        this.slotResponse = slotResponse;
        this.staffSlotResponse = staffSlotResponse;
        this.roomSlotResponse = roomSlotResponse;
    }

    public RoomSlotResponse getRoomSlotResponse() {
        return roomSlotResponse;
    }

    public void setRoomSlotResponse(RoomSlotResponse roomSlotResponse) {
        this.roomSlotResponse = roomSlotResponse;
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
