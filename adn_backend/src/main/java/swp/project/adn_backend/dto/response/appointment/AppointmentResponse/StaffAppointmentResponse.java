package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffAppointmentResponse {
    long staffId;
    String fullName;
    String email;
    String phone;

    public StaffAppointmentResponse() {
    }

    public StaffAppointmentResponse(long staffId, String fullName, String email, String phone) {
        this.staffId = staffId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
    }

    public long getStaffId() {
        return staffId;
    }

    public void setStaffId(long staffId) {
        this.staffId = staffId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
