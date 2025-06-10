package swp.project.adn_backend.dto.response.appointment;

import jakarta.persistence.Column;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.sql.Time;
import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class SlotAppointmentResponse {
    long slotId;
    LocalDate slotDate;
    Time startTime;
    Time endTime;
    String room;

    public SlotAppointmentResponse(long slotId, LocalDate slotDate, Time startTime, Time endTime, String room) {
        this.slotId = slotId;
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.room = room;
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

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }
}
