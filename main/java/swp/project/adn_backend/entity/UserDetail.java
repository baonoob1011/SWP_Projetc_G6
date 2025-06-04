package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;


@Entity
@Table(name = "UserDetail")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_detail_id")
    long userDetailId;

    @Column(name = "full_name", columnDefinition = "NVARCHAR(100)")
    String fullName;
    @Column(name = "id_card")
    String idCard;
    @Column(columnDefinition = "NVARCHAR(10)")
    String gender;
    @Column(columnDefinition = "nvarchar(255)")
    String address;
    String phone;
}