package swp.project.adn_backend.dto.InfoDTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import swp.project.adn_backend.enums.AlleleStatus;

public class AlleleInfoDTO {
    private long alleleId;
    private double alleleValue;
    private String allelePosition;
    private AlleleStatus alleleStatus;

    public AlleleInfoDTO(long alleleId, double alleleValue, String allelePosition, AlleleStatus alleleStatus) {
        this.alleleId = alleleId;
        this.alleleValue = alleleValue;
        this.allelePosition = allelePosition;
        this.alleleStatus = alleleStatus;
    }

    public long getAlleleId() {
        return alleleId;
    }

    public void setAlleleId(long alleleId) {
        this.alleleId = alleleId;
    }

    public double getAlleleValue() {
        return alleleValue;
    }

    public void setAlleleValue(double alleleValue) {
        this.alleleValue = alleleValue;
    }

    public String getAllelePosition() {
        return allelePosition;
    }

    public void setAllelePosition(String allelePosition) {
        this.allelePosition = allelePosition;
    }

    public AlleleStatus getAlleleStatus() {
        return alleleStatus;
    }

    public void setAlleleStatus(AlleleStatus alleleStatus) {
        this.alleleStatus = alleleStatus;
    }
}
