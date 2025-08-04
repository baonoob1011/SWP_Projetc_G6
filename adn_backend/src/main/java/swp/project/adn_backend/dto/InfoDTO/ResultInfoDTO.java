package swp.project.adn_backend.dto.InfoDTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import swp.project.adn_backend.enums.AlleleStatus;
import swp.project.adn_backend.enums.HardCopyDeliveryStatus;

public class ResultInfoDTO {
    long result_id;

    HardCopyDeliveryStatus hardCopyDeliveryStatus;
    long appointmentId;

    public ResultInfoDTO(long result_id, HardCopyDeliveryStatus hardCopyDeliveryStatus, long appointmentId) {
        this.result_id = result_id;
        this.hardCopyDeliveryStatus = hardCopyDeliveryStatus;
        this.appointmentId = appointmentId;
    }

    public long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public long getResult_id() {
        return result_id;
    }

    public void setResult_id(long result_id) {
        this.result_id = result_id;
    }

    public HardCopyDeliveryStatus getHardCopyDeliveryStatus() {
        return hardCopyDeliveryStatus;
    }

    public void setHardCopyDeliveryStatus(HardCopyDeliveryStatus hardCopyDeliveryStatus) {
        this.hardCopyDeliveryStatus = hardCopyDeliveryStatus;
    }
}
