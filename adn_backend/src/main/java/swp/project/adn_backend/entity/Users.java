package swp.project.adn_backend.entity;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import swp.project.adn_backend.enums.Roles;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Users")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    long userId;

    @Column(name = "id_card")
    String idCard;

    @Column(columnDefinition = "NVARCHAR(10)")
    String gender;
    @Column(columnDefinition = "nvarchar(255)")
    String address;
    @Column(name = "day_of_birth")
    LocalDate dateOfBirth;

    @Column(name = "full_name", columnDefinition = "nvarchar(255)")
    String fullName;

    @Column(columnDefinition = "nvarchar(255)")
    String username;

    @Column(columnDefinition = "nvarchar(255)")
    String password;

    @Column(columnDefinition = "nvarchar(20)")
    String phone;

    @Column(columnDefinition = "nvarchar(255)")
    String email;

    Boolean enabled = true;

     String otpCode;
     LocalDateTime otpExpiryTime;

    @Column(name = "last_otp_sent_time", nullable = true) // Có thể null
    private LocalDateTime lastOtpSentTime;

    public LocalDateTime getLastOtpSentTime() {
        return lastOtpSentTime;
    }

    public void setLastOtpSentTime(LocalDateTime lastOtpSentTime) {
        this.lastOtpSentTime = lastOtpSentTime;
    }

    @CreationTimestamp
    @Column(name = "create_at", updatable = false)
    LocalDateTime createAt;

   String role;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @OneToMany(mappedBy = "users", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<Patient> patients;

    @OneToMany(mappedBy = "users", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<Appointment> appointments;

    @OneToMany(mappedBy = "users", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<ServiceTest> services;

    @OneToMany(mappedBy = "users", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<Feedback> feedbacks;

    @OneToMany(mappedBy = "users", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<Staff> staff;

    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public List<Staff> getStaff() {
        return staff;
    }

    public void setStaff(List<Staff> staff) {
        this.staff = staff;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }


    public LocalDateTime getCreateAt() {
        return createAt;
    }

    public void setCreateAt(LocalDateTime createAt) {
        this.createAt = createAt;
    }

    public List<Patient> getPatients() {
        return patients;
    }

    public void setPatients(List<Patient> patients) {
        this.patients = patients;
    }

    public List<Appointment> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<Appointment> appointments) {
        this.appointments = appointments;
    }

    public List<ServiceTest> getServices() {
        return services;
    }

    public void setServices(List<ServiceTest> services) {
        this.services = services;
    }

    public List<Feedback> getFeedbacks() {
        return feedbacks;
    }

    public void setFeedbacks(List<Feedback> feedbacks) {
        this.feedbacks = feedbacks;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public LocalDateTime getOtpExpiryTime() {
        return otpExpiryTime;
    }

    public void setOtpExpiryTime(LocalDateTime otpExpiryTime) {
        this.otpExpiryTime = otpExpiryTime;
    }
}

