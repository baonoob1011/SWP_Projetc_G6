package swp.project.adn_backend.dto.response.slot;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

public class SlotResponse {
    long slotId;
    LocalDate slotDate;
    LocalTime  startTime;
    LocalTime  endTime;

    public SlotResponse(long slotId, LocalDate slotDate, LocalTime startTime, LocalTime endTime) {
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

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}
