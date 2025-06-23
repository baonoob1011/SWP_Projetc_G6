package swp.project.adn_backend.dto.InfoDTO;

import swp.project.adn_backend.enums.AppointmentStatus;
import swp.project.adn_backend.enums.AppointmentType;

import java.time.LocalDate;

public class  AppointmentAtHomeInfoDTO {
    private long appointmentId;
    private LocalDate appointmentDate;
    private AppointmentStatus appointmentStatus;
    private String note;
    private AppointmentType appointmentType;
    private long staffId;
    private long serviceId;
    private long userId;

    public AppointmentAtHomeInfoDTO(long appointmentId, LocalDate appointmentDate, AppointmentStatus appointmentStatus, String note, AppointmentType appointmentType, long staffId, long serviceId, long userId) {
        this.appointmentId = appointmentId;
        this.appointmentDate = appointmentDate;
        this.appointmentStatus = appointmentStatus;
        this.note = note;
        this.appointmentType = appointmentType;
        this.staffId = staffId;
        this.serviceId = serviceId;
        this.userId = userId;
    }

    public long getServiceId() {
        return serviceId;
    }

    public void setServiceId(long serviceId) {
        this.serviceId = serviceId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getStaffId() {
        return staffId;
    }

    public void setStaffId(long staffId) {
        this.staffId = staffId;
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
