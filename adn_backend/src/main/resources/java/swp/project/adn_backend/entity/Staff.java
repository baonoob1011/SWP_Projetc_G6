package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Staff")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_id")
    long staffId;

    @Column(name = "full_name", columnDefinition = "NVARCHAR(100)")
    String fullName;

    String email;
    String username;
    String password;
    boolean enabled = true;
    String role = "ROLE_STAFF";
    @Column(columnDefinition = "NVARCHAR(10)")
    String gender;
    String address;
    String phone;
    @Lob
    @Column(name = "birth_certificate")
    String birthCertificate;

    @CreationTimestamp
    @Column(name = "create_at", updatable = false)
    private LocalDateTime createAt;
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

}
