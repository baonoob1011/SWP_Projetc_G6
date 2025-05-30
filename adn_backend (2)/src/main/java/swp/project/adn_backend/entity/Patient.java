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
@Table(name = "Patient")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Patient {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "patient_id")
    long patientId;

    @Column(name = "full_name")
    String fullName;

    String email;
    String phone;
    String address;

    @Column(name = "date_of_birth")
    LocalDate dateOfBirth;

    @Column(name = "identity_number")
    String identityNumber;

    String gender;
    String relationship;

    @Lob
    @Column(name = "birth_certificate")
    String birthCertificate;

    @ManyToOne(cascade = {
         CascadeType.ALL
    })
    @JoinColumn(name = "appointment_id", nullable = false)
    Appointment appointment;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "user_id", nullable = false)
    Users users;

    @OneToMany(mappedBy = "", fetch = FetchType.LAZY, cascade = {
            CascadeType.ALL
    })
    List<Sample> samples;
}
