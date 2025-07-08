package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp.project.adn_backend.enums.RoomStatus;

import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private long roomId;
    private String roomName;
    @Enumerated(EnumType.STRING)
    private RoomStatus roomStatus;
    @Column(name = "open_time")
    private LocalTime openTime;

    @Column(name = "close_time")
    private LocalTime closeTime;
    @ManyToOne(fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "location_id")
    Location location;

    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    private List<Slot> slots;

    public Room() {
    }

    public Room(long roomId, String roomName, RoomStatus roomStatus, LocalTime openTime, LocalTime closeTime, List<Slot> slots) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.roomStatus = roomStatus;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.slots = slots;
    }



    public RoomStatus getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(RoomStatus roomStatus) {
        this.roomStatus = roomStatus;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }


    public long getRoomId() {
        return roomId;
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

    public void setRoomId(long roomId) {
        this.roomId = roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }



    public List<Slot> getSlots() {
        return slots;
    }

    public void setSlots(List<Slot> slots) {
        this.slots = slots;
    }
}
