package swp.project.adn_backend.dto.response.serviceResponse;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.entity.Slot;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.AppointmentStatus;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppointmentResponse {
    LocalDate appointmentDate;
    AppointmentStatus appointmentStatus;
    String note;
    ServiceTest serviceTest;
    Users users;
    Staff staff;
    Slot slot;

    public Slot getSlot() {
        return slot;
    }

    public void setSlot(Slot slot) {
        this.slot = slot;
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

    public ServiceTest getServiceTest() {
        return serviceTest;
    }

    public void setServiceTest(ServiceTest serviceTest) {
        this.serviceTest = serviceTest;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
