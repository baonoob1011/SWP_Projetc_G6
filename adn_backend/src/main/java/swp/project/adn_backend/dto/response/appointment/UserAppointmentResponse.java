package swp.project.adn_backend.dto.response.appointment;

import jakarta.persistence.Column;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserAppointmentResponse {
    String address;
    String fullName;
    String phone;
    String email;

    public UserAppointmentResponse(String address, String fullName, String phone, String email) {
        this.address = address;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
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
