package swp.project.adn_backend.dto.InfoDTO;

import swp.project.adn_backend.enums.AppointmentStatus;

import java.time.LocalDate;

public class AppointmentInfoForManagerDTO {
    private long appointmentId;
    private LocalDate appointmentDate;
    private AppointmentStatus appointmentStatus;
    private String note;


    public AppointmentInfoForManagerDTO(long appointmentId, LocalDate appointmentDate, AppointmentStatus appointmentStatus, String note) {
        this.appointmentId = appointmentId;
        this.appointmentDate = appointmentDate;
        this.appointmentStatus = appointmentStatus;
        this.note = note;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
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

}
