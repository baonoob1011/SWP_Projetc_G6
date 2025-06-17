package swp.project.adn_backend.dto.response.result;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class ResultDetailResponse {

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
