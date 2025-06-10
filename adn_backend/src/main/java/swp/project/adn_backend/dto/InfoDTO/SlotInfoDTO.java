package swp.project.adn_backend.dto.InfoDTO;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.sql.Time;
import java.time.LocalDate;

public class SlotInfoDTO {
    long slotId;
    LocalDate slotDate;
    Time startTime;
    Time endTime;
    String location;


    public SlotInfoDTO(long slotId, LocalDate slotDate, Time startTime, Time endTime, String location) {
        this.slotId = slotId;
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
