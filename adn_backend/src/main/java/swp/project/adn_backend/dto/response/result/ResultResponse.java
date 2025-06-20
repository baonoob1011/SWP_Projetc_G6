package swp.project.adn_backend.dto.response.result;


import swp.project.adn_backend.enums.ResultStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ResultResponse {
    LocalDate collectionDate;
    LocalDate resultDate;
    ResultStatus resultStatus;

    public ResultResponse(LocalDate collectionDate, LocalDate resultDate, ResultStatus resultStatus) {
        this.collectionDate = collectionDate;
        this.resultDate = resultDate;
        this.resultStatus = resultStatus;
    }

    public LocalDate getCollectionDate() {
        return collectionDate;
    }

    public void setCollectionDate(LocalDate collectionDate) {
        this.collectionDate = collectionDate;
    }

    public LocalDate getResultDate() {
        return resultDate;
    }

    public void setResultDate(LocalDate resultDate) {
        this.resultDate = resultDate;
    }

    public ResultStatus getResultStatus() {
        return resultStatus;
    }

    public void setResultStatus(ResultStatus resultStatus) {
        this.resultStatus = resultStatus;
    }
}
