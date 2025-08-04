package swp.project.adn_backend.dto.request;

import swp.project.adn_backend.enums.HardCopyDeliveryStatus;

public class HardCopyDeliveryRequest {
    HardCopyDeliveryStatus hardCopyDeliveryStatus;

    public HardCopyDeliveryStatus getHardCopyDeliveryStatus() {
        return hardCopyDeliveryStatus;
    }

    public void setHardCopyDeliveryStatus(HardCopyDeliveryStatus hardCopyDeliveryStatus) {
        this.hardCopyDeliveryStatus = hardCopyDeliveryStatus;
    }
}
