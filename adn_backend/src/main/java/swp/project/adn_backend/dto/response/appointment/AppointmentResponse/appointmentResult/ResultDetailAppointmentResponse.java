package swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult;

import jakarta.persistence.Column;

public class ResultDetailAppointmentResponse {
    long resultDetailId;

    double combinedPaternityIndex;
    double paternityProbability;
    String conclusion;
    String resultSummary;

    public long getResultDetailId() {
        return resultDetailId;
    }

    public void setResultDetailId(long resultDetailId) {
        this.resultDetailId = resultDetailId;
    }

    public double getCombinedPaternityIndex() {
        return combinedPaternityIndex;
    }

    public void setCombinedPaternityIndex(double combinedPaternityIndex) {
        this.combinedPaternityIndex = combinedPaternityIndex;
    }

    public double getPaternityProbability() {
        return paternityProbability;
    }

    public void setPaternityProbability(double paternityProbability) {
        this.paternityProbability = paternityProbability;
    }

    public String getConclusion() {
        return conclusion;
    }

    public void setConclusion(String conclusion) {
        this.conclusion = conclusion;
    }

    public String getResultSummary() {
        return resultSummary;
    }

    public void setResultSummary(String resultSummary) {
        this.resultSummary = resultSummary;
    }
}
