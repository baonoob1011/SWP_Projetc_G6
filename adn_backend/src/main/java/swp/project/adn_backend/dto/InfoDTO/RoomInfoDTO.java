package swp.project.adn_backend.dto.InfoDTO;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import swp.project.adn_backend.enums.RoomStatus;

import java.time.LocalTime;

public class RoomInfoDTO {
    private long roomId;
    private String roomName;
    private RoomStatus roomStatus;
    private LocalTime openTime;
    private LocalTime closeTime;

    public RoomInfoDTO(long roomId, String roomName, RoomStatus roomStatus, LocalTime openTime, LocalTime closeTime) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.roomStatus = roomStatus;
        this.openTime = openTime;
        this.closeTime = closeTime;
    }

    public RoomInfoDTO() {

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
}
