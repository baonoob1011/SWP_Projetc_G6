package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.SampleStatus;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Sample")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Sample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sample_id")
    long sampleId;

    @Column(name = "sample_type")
    String sampleType;

    @Column(name = "collection_date")
    LocalDateTime collectionDate;

    @Column(name = "sample_status")
    SampleStatus sampleStatus;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "appointment_id", nullable = false)
    Appointment appointment;

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
    @JoinColumn(name = "kit_id", nullable = false)
    Kit kit;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "staff_id", nullable = false)
    Staff staff;

    @OneToMany(mappedBy = "sample", fetch = FetchType.LAZY, cascade = {
            CascadeType.ALL
    })
    List<Result> results;


}
