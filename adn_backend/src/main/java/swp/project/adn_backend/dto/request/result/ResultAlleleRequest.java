package swp.project.adn_backend.dto.request.result;

import swp.project.adn_backend.enums.AlleleStatus;

public class ResultAlleleRequest {
    private double alleleValue;
    private String allelePosition;
    private AlleleStatus alleleStatus;


    public AlleleStatus getAlleleStatus() {
        return alleleStatus;
    }

    public void setAlleleStatus(AlleleStatus alleleStatus) {
        this.alleleStatus = alleleStatus;
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
}
