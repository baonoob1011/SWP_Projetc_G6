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

    long resultDetailId;


    double combinedPaternityIndex;

    String conclusion;


    String resultSummary;

    Result result;

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

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }
}
