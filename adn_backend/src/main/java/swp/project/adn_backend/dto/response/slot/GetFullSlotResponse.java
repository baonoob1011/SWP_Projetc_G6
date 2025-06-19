package swp.project.adn_backend.dto.response.slot;

import java.util.List;

public class GetFullSlotResponse {
    private SlotResponse slotResponse;
    private List<StaffSlotResponse> staffSlotResponses;
    private RoomSlotResponse roomSlotResponse;
//    private UserSlotResponse userSlotResponse;

    public GetFullSlotResponse() {
    }


    public GetFullSlotResponse(SlotResponse slotResponse, List<StaffSlotResponse> staffSlotResponses, RoomSlotResponse roomSlotResponse) {
        this.slotResponse = slotResponse;
        this.staffSlotResponses = staffSlotResponses;
        this.roomSlotResponse = roomSlotResponse;
    }

    public SlotResponse getSlotResponse() {
        return slotResponse;
    }

    public void setSlotResponse(SlotResponse slotResponse) {
        this.slotResponse = slotResponse;
    }

    public List<StaffSlotResponse> getStaffSlotResponses() {
        return staffSlotResponses;
    }

    public void setStaffSlotResponses(List<StaffSlotResponse> staffSlotResponses) {
        this.staffSlotResponses = staffSlotResponses;
    }

    public RoomSlotResponse getRoomSlotResponse() {
        return roomSlotResponse;
    }

    public void setRoomSlotResponse(RoomSlotResponse roomSlotResponse) {
        this.roomSlotResponse = roomSlotResponse;
    }
}
