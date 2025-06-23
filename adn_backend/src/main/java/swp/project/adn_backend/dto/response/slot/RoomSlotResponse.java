package swp.project.adn_backend.dto.response.slot;

import swp.project.adn_backend.enums.RoomStatus;

import java.time.LocalTime;

public class RoomSlotResponse {
    private long roomId;
    private String roomName;
    private LocalTime openTime;
    private LocalTime closeTime;

    public RoomSlotResponse() {
    }

    public RoomSlotResponse(long roomId, String roomName, LocalTime openTime, LocalTime closeTime) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.openTime = openTime;
        this.closeTime = closeTime;
    }

    public long getRoomId() {
        return roomId;
    }

    public void setRoomId(long roomId) {
        this.roomId = roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }



    public LocalTime getOpenTime() {
        return openTime;
    }

    public void setOpenTime(LocalTime openTime) {
        this.openTime = openTime;
    }

    public LocalTime getCloseTime() {
        return closeTime;
    }

    public void setCloseTime(LocalTime closeTime) {
        this.closeTime = closeTime;
    }
}
