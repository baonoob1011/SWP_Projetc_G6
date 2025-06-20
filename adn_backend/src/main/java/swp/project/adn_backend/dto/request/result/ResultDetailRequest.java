package swp.project.adn_backend.dto.request.result;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.entity.Result;

@AllArgsConstructor
@NoArgsConstructor
public class ResultDetailRequest {

    double combinedPaternityIndex;
    double paternityProbability;
    String conclusion;
    String resultSummary;

    public double getPaternityProbability() {
        return paternityProbability;
    }

    public void setPaternityProbability(double paternityProbability) {
        this.paternityProbability = paternityProbability;
    }

    public double getCombinedPaternityIndex() {
        return combinedPaternityIndex;
    }

    public void setCombinedPaternityIndex(double combinedPaternityIndex) {
        this.combinedPaternityIndex = combinedPaternityIndex;
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
