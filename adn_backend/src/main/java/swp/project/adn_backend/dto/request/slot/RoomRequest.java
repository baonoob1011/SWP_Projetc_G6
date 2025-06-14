package swp.project.adn_backend.dto.request.slot;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp.project.adn_backend.enums.RoomStatus;

import java.time.LocalTime;

public class RoomRequest {
    private long roomId;
    private String roomName;
    private LocalTime openTime;
    private LocalTime closeTime;
    private RoomStatus roomStatus;

    public RoomRequest(long roomId, String roomName, LocalTime openTime, LocalTime closeTime, RoomStatus roomStatus) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.roomStatus = roomStatus;
    }

    public RoomStatus getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(RoomStatus roomStatus) {
        this.roomStatus = roomStatus;
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

    public RoomRequest() {
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

}
