package swp.project.adn_backend.dto.request.slot;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.entity.Appointment;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@FieldDefaults(level = AccessLevel.PRIVATE)
public class SlotRequest {

    @NotNull(message = "Slot date must not be null")
    @FutureOrPresent(message = "Slot date must be today or in the future")
    private LocalDate slotDate;

    @NotNull(message = "Start time must not be null")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private LocalTime startTime;

    @NotNull(message = "End time must not be null")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private LocalTime endTime;

    public SlotRequest(LocalDate slotDate, LocalTime startTime, LocalTime endTime) {
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public SlotRequest() {

    }

    public @NotNull(message = "Slot date must not be null") @FutureOrPresent(message = "Slot date must be today or in the future") LocalDate getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(@NotNull(message = "Slot date must not be null") @FutureOrPresent(message = "Slot date must be today or in the future") LocalDate slotDate) {
        this.slotDate = slotDate;
    }

    public @NotNull(message = "Start time must not be null") LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(@NotNull(message = "Start time must not be null") LocalTime startTime) {
        this.startTime = startTime;
    }

    public @NotNull(message = "End time must not be null") LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(@NotNull(message = "End time must not be null") LocalTime endTime) {
        this.endTime = endTime;
    }
}
