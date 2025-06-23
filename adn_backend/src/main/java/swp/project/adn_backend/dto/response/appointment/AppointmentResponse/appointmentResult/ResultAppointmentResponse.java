package swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult;

import jakarta.persistence.Column;
import swp.project.adn_backend.enums.ResultStatus;

import java.time.LocalDate;

public class ResultAppointmentResponse {
    long result_id;
    LocalDate resultDate;
    ResultStatus resultStatus;

    public long getResult_id() {
        return result_id;
    }

    public void setResult_id(long result_id) {
        this.result_id = result_id;
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
