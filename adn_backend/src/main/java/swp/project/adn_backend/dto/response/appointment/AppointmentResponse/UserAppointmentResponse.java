package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.UserStatus;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserAppointmentResponse {
    long userId;
    String address;
    String fullName;
    String phone;
    String email;

    public UserAppointmentResponse() {
    }

    public UserAppointmentResponse(long userId, String address, String fullName, String phone, String email, UserStatus userStatus) {
        this.userId = userId;
        this.address = address;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;

    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
