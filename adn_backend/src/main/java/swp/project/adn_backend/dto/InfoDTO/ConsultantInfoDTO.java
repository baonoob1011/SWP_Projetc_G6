package swp.project.adn_backend.dto.InfoDTO;

import swp.project.adn_backend.enums.ConsultationStatus;

public class ConsultantInfoDTO {
    private long registerForConsultationId;
    private String name;
    private String phone;
    private ConsultationStatus consultationStatus;

    public ConsultantInfoDTO(long registerForConsultationId, String name, String phone, ConsultationStatus consultationStatus) {
        this.registerForConsultationId = registerForConsultationId;
        this.name = name;
        this.phone = phone;
        this.consultationStatus = consultationStatus;
    }

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
