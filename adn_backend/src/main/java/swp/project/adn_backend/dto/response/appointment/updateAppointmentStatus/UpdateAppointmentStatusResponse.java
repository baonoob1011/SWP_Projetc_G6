package swp.project.adn_backend.dto.response.appointment.updateAppointmentStatus;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.AppointmentStatus;

import java.time.LocalDate;


@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateAppointmentStatusResponse {
    LocalDate appointmentDate;
    AppointmentStatus appointmentStatus;
    String note;

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }


    public AppointmentStatus getAppointmentStatus() {
        return appointmentStatus;
    }

    public void setAppointmentStatus(AppointmentStatus appointmentStatus) {
        this.appointmentStatus = appointmentStatus;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
