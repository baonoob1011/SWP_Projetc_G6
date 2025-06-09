package swp.project.adn_backend.dto.request.registerConsultation;

import swp.project.adn_backend.enums.ConsultationStatus;

public class RegisterConsultationRequest {
    private String name;
    private String phone;
    private ConsultationStatus consultationStatus;

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
