package swp.project.adn_backend.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.*;
import swp.project.adn_backend.enums.ConsultationStatus;

@Entity
@Table(name = "register_for_consultation")
public class RegisterForConsultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long registerForConsultationId;
    @Column(columnDefinition = "NVARCHAR(100)")
    private String name;
    private String phone;
    @Column(name = "consultation_status")
    @Enumerated(EnumType.STRING)
    private ConsultationStatus consultationStatus;

    public long getRegisterForConsultationId() {
        return registerForConsultationId;
    }

    public void setRegisterForConsultationId(long registerForConsultationId) {
        this.registerForConsultationId = registerForConsultationId;
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
