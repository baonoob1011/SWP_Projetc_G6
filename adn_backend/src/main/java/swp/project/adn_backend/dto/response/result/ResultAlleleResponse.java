package swp.project.adn_backend.dto.response.result;

import swp.project.adn_backend.enums.AlleleStatus;

public class ResultAlleleResponse {
    private long alleleId;
    private double alleleValue;
    private String allelePosition;
    private AlleleStatus alleleStatus;
    public long getAlleleId() {
        return alleleId;
    }

    public void setAlleleId(long alleleId) {
        this.alleleId = alleleId;
    }

    public double getAlleleValue() {
        return alleleValue;
    }

    public AlleleStatus getAlleleStatus() {
        return alleleStatus;
    }

    public void setAlleleStatus(AlleleStatus alleleStatus) {
        this.alleleStatus = alleleStatus;
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
}
