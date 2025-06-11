package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.SlotStatus;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;


@Entity
@Table(name = "Slot")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Slot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    long slotId;
    @Column(name = "slot_date")
    LocalDate slotDate;
    @Column(name = "start_time")
    Time  startTime;
    @Column(name = "end_time")
    Time  endTime;

    @Enumerated(EnumType.STRING)
    SlotStatus slotStatus;

//    @OneToOne(cascade = {
//            CascadeType.PERSIST, CascadeType.MERGE,
//            CascadeType.DETACH, CascadeType.REFRESH
//    })
//    @JoinColumn(name = "user_id")
//    Users users;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "staff_id")
    Staff staff;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "room_id")
    Room room;


    @OneToMany(mappedBy = "slot", fetch = FetchType.LAZY, cascade = {
            CascadeType.ALL
    })
    List<Appointment> appointment;

    public List<Appointment> getAppointment() {
        return appointment;
    }

    public void setAppointment(List<Appointment> appointment) {
        this.appointment = appointment;
    }


    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    //
//    public Users getUsers() {
//        return users;
//    }
//
//    public void setUsers(Users users) {
//        this.users = users;
//    }

    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    public SlotStatus getSlotStatus() {
        return slotStatus;
    }

    public void setSlotStatus(SlotStatus slotStatus) {
        this.slotStatus = slotStatus;
    }

    public Time getStartTime() {
        return startTime;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    public long getSlotId() {
        return slotId;
    }

    public void setSlotId(long slotId) {
        this.slotId = slotId;
    }

    public LocalDate getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(LocalDate slotDate) {
        this.slotDate = slotDate;
    }

    //    public List<Appointment> getAppointment() {
//        return appointment;
//    }
//
//    public void setAppointment(List<Appointment> appointment) {
//        this.appointment = appointment;
//    }
}
