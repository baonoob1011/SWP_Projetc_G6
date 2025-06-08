package swp.project.adn_backend.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.*;

@Entity
@Table(name = "register_for_consultation")
public class RegisterForConsultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long register_for_consultation_id;
    @Column(columnDefinition = "NVARCHAR(100)")
    private String name;
    private String phone;
}
