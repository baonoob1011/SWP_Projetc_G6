package swp.project.adn_backend.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.*;
import swp.project.adn_backend.enums.ConsultationStatus;

@Entity
@Table(name = "register_for_consultation")
public class RegisterForConsultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long register_for_consultation_id;
    @Column(columnDefinition = "NVARCHAR(100)")
    private String name;
    private String phone;
    @Column(name = "consultation-status")
    @Enumerated(EnumType.STRING)
    private ConsultationStatus consultationStatus;

    public long getRegister_for_consultation_id() {
        return register_for_consultation_id;
    }

    public void setRegister_for_consultation_id(long register_for_consultation_id) {
        this.register_for_consultation_id = register_for_consultation_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public ConsultationStatus getConsultationStatus() {
        return consultationStatus;
    }

    public void setConsultationStatus(ConsultationStatus consultationStatus) {
        this.consultationStatus = consultationStatus;
    }
}
