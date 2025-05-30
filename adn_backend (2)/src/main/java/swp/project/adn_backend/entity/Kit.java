package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Kit")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Kit {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "kit_id")
    long kitId;

    @Column(name = "kit_name")
    String kitName;

    @Column(name = "delivery_date")
    LocalDate deliveryDate;

    @Column(name = "return_date")
    LocalDate returnDate;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "patient_id", nullable = false)
    Patient patient;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "civil_service_id", nullable = false)
    CivilService civilService;

    @OneToMany(mappedBy = "kit", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    List<Sample> sample;
}
