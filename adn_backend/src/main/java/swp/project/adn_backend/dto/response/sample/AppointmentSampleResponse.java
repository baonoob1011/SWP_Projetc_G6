package swp.project.adn_backend.dto.response.sample;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.AppointmentStatus;
import swp.project.adn_backend.enums.AppointmentType;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentSampleResponse {
    long appointmentId;
    LocalDate appointmentDate;
    AppointmentStatus appointmentStatus;
    String note;
    AppointmentType appointmentType;

    public AppointmentSampleResponse(long appointmentId, LocalDate appointmentDate, AppointmentStatus appointmentStatus, String note, AppointmentType appointmentType) {
        this.appointmentId = appointmentId;
        this.appointmentDate = appointmentDate;
        this.appointmentStatus = appointmentStatus;
        this.note = note;
        this.appointmentType = appointmentType;
    }

    public AppointmentType getAppointmentType() {
        return appointmentType;
    }

    public void setAppointmentType(AppointmentType appointmentType) {
        this.appointmentType = appointmentType;
    }

    public long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(long appointmentId) {
        this.appointmentId = appointmentId;
    }

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
