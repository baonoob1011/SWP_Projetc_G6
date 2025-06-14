package swp.project.adn_backend.dto.InfoDTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import swp.project.adn_backend.enums.SlotStatus;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

public class SlotInfoDTO {
    long slotId;
    LocalDate slotDate;
    LocalTime startTime;
    LocalTime endTime;
    SlotStatus slotStatus;


    public SlotInfoDTO(long slotId, LocalDate slotDate, LocalTime startTime, LocalTime endTime, SlotStatus slotStatus) {
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
