package swp.project.adn_backend.dto.response.appointment.ViewAppointment;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.sql.Time;
import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class VIewSlotAppointmentResponse {
    long slotId;
    LocalDate slotDate;
    Time  startTime;
    Time  endTime;

    public VIewSlotAppointmentResponse(long slotId, LocalDate slotDate, Time startTime, Time endTime) {
        this.slotId = slotId;
        this.slotDate = slotDate;
        this.startTime = startTime;
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
}
