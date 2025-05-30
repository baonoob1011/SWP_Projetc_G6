package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Service")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    long serviceId;

    String description;
    // Hành Chính, Dân sự
    @Column(name = "service_type")
    String serviceType;

    @Column(name = "is_active")
    boolean isActive;

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


}
