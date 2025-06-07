package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.hibernate.annotations.Where;
import swp.project.adn_backend.enums.ServiceType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Where(clause = "is_active = true")
@Table(name = "Service")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    long serviceId;

    @Column(name = "service_name",columnDefinition = "nvarchar(255)")
    String serviceName;

    @Column(name = "registed_date",columnDefinition = "nvarchar(255)")
    LocalDate registerDate;

    @Column(columnDefinition = "nvarchar(255)")
    String description;
    // Hành Chính, Dân sự
    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", columnDefinition = "nvarchar(255)")
    private ServiceType serviceType;

    @Column(name = "is_active")
    boolean isActive;

    @Column(name = "image", columnDefinition = "nvarchar(max)")
    @Lob
    private String image;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "user_id", nullable = false)
    Users users;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinTable(
            name = "appointment_service",
            joinColumns = @JoinColumn(name = "service_id"),
            inverseJoinColumns = @JoinColumn(name = "appointment_id")
    )
    List<Appointment> appointments;

    @OneToMany(mappedBy = "service", fetch = FetchType.LAZY, cascade = {
            CascadeType.ALL
    })
    List<CivilService> civilServices;

    @OneToMany(mappedBy = "service", fetch = FetchType.LAZY, cascade = {
            CascadeType.ALL
    })
    List<AdministrativeService> administrativeService;

    @OneToMany(mappedBy = "service", fetch = FetchType.LAZY, cascade = {
            CascadeType.ALL
    })
    List<Feedback> feedbacks;

    @OneToMany(mappedBy = "service", fetch = FetchType.LAZY, cascade = {
            CascadeType.ALL
    })
    List<PriceList> priceLists;

    @OneToMany(mappedBy = "service", fetch = FetchType.LAZY, cascade = {
            CascadeType.ALL
    })
    List<Discount> discounts;

    public long getServiceId() {
        return serviceId;
    }

    public void setServiceId(long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public LocalDate getRegisterDate() {
        return registerDate;
    }

    public void setRegisterDate(LocalDate registerDate) {
        this.registerDate = registerDate;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ServiceType getServiceType() {
        return serviceType;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public List<Appointment> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<Appointment> appointments) {
        this.appointments = appointments;
    }

    public List<CivilService> getCivilServices() {
        return civilServices;
    }

    public void setCivilServices(List<CivilService> civilServices) {
        this.civilServices = civilServices;
    }

    public List<AdministrativeService> getAdministrativeService() {
        return administrativeService;
    }

    public void setAdministrativeService(List<AdministrativeService> administrativeService) {
        this.administrativeService = administrativeService;
    }

    public List<Feedback> getFeedbacks() {
        return feedbacks;
    }

    public void setFeedbacks(List<Feedback> feedbacks) {
        this.feedbacks = feedbacks;
    }

    public List<PriceList> getPriceLists() {
        return priceLists;
    }

    public void setPriceLists(List<PriceList> priceLists) {
        this.priceLists = priceLists;
    }

    public List<Discount> getDiscounts() {
        return discounts;
    }

    public void setDiscounts(List<Discount> discounts) {
        this.discounts = discounts;
    }
}
