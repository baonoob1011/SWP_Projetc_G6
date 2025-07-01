package swp.project.adn_backend.dto.response.registerConsultation;

import swp.project.adn_backend.enums.ConsultationStatus;

public class RegisterConsultationResponse {
    private long registerForConsultationId;
    private String name;
    private String phone;
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
