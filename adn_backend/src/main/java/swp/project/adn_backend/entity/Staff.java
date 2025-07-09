package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.enums.StaffStatus;


import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Staff")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Staff {
    @Id
    @Column(name = "staff_id")
    long staffId;

    @Column(name = "full_name", columnDefinition = "NVARCHAR(100)")
    String fullName;
    @Column(name = "id_card")
    String idCard;

    String email;
    boolean enabled = true;
    String role;
    @Column(columnDefinition = "NVARCHAR(10)")
    String gender;
    @Column(columnDefinition = "nvarchar(255)")
    String address;
    String phone;
    StaffStatus staffStatus;

    @Column(name = "day_of_birth")
    LocalDate dateOfBirth;
    @Column(name = "avatar_url")
    private String avatarUrl;
    @OneToMany(mappedBy = "staff", fetch = FetchType.LAZY, cascade = {
            CascadeType.ALL
    })
    List<KitDeliveryStatus> kitDeliveryStatuses;

    @Column(name = "create_at")
    LocalDate createAt;
    //nhân viên lấy mẫu
    @OneToMany(mappedBy = "staff", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    List<Sample> samples;

    @OneToMany(mappedBy = "staff", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    List<Appointment> appointments;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "user_id", nullable = false)
    Users users;

    @ManyToMany(mappedBy = "staff", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    private List<Slot> slots;

    public List<KitDeliveryStatus> getKitDeliveryStatuses() {
        return kitDeliveryStatuses;
    }

    public void setKitDeliveryStatuses(List<KitDeliveryStatus> kitDeliveryStatuses) {
        this.kitDeliveryStatuses = kitDeliveryStatuses;
    }

    @OneToOne(mappedBy = "staff", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    // trỏ đến tên biến bên Notification
    private Notification notification;

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Notification getNotification() {
        return notification;
    }

    public void setNotification(Notification notification) {
        this.notification = notification;
    }

    public StaffStatus getStaffStatus() {
        return staffStatus;
    }

    public void setStaffStatus(StaffStatus staffStatus) {
        this.staffStatus = staffStatus;
    }

    public List<Slot> getSlots() {
        return slots;
    }

    public void setSlots(List<Slot> slots) {
        this.slots = slots;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
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

    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public LocalDate getCreateAt() {
        return createAt;
    }

    public void setCreateAt(LocalDate createAt) {
        this.createAt = createAt;
    }

    public List<Sample> getSamples() {
        return samples;
    }

    public void setSamples(List<Sample> samples) {
        this.samples = samples;
    }

    public List<Appointment> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<Appointment> appointments) {
        this.appointments = appointments;
    }
}
