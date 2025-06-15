package swp.project.adn_backend.dto.InfoDTO;

import swp.project.adn_backend.enums.AppointmentStatus;

import java.time.LocalDate;

public class AppointmentInfoDTO {
    private long appointmentId;
    private LocalDate appointmentDate;
    private AppointmentStatus appointmentStatus;
    private String note;
    private long userId;
    private long serviceId;
    private long slotId;
    private long locationId;

    public AppointmentInfoDTO(Long appointmentId, LocalDate appointmentDate, AppointmentStatus appointmentStatus,
                              String note, Long userId, Long slotId, Long serviceId, Long locationId) {
        this.appointmentId = appointmentId;
        this.appointmentDate = appointmentDate;
        this.appointmentStatus = appointmentStatus;
        this.note = note;
        this.userId = userId;
        this.slotId = slotId;
        this.serviceId = serviceId;
        this.locationId = locationId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getServiceId() {
        return serviceId;
    }

    public void setServiceId(long serviceId) {
        this.serviceId = serviceId;
    }

    public long getSlotId() {
        return slotId;
    }

    public void setSlotId(long slotId) {
        this.slotId = slotId;
    }

    public long getLocationId() {
        return locationId;
    }

    public void setLocationId(long locationId) {
        this.locationId = locationId;
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
