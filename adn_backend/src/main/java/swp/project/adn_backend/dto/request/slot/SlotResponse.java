package swp.project.adn_backend.dto.request.slot;

import com.fasterxml.jackson.annotation.JsonFormat;
import swp.project.adn_backend.enums.SlotStatus;

import java.sql.Time;
import java.time.LocalDate;

public class SlotResponse {
    long slotId;
    LocalDate slotDate;
    Time  startTime;
    Time  endTime;
    SlotStatus slotStatus;

    public SlotResponse(long slotId, LocalDate slotDate, Time startTime, Time endTime, SlotStatus slotStatus) {
        this.slotId = slotId;
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.slotStatus = slotStatus;
    }

    public SlotStatus getSlotStatus() {
        return slotStatus;
    }

    public void setSlotStatus(SlotStatus slotStatus) {
        this.slotStatus = slotStatus;
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
