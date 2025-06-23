package swp.project.adn_backend.service.result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.response.result.ResultDetailResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.PatientStatus;
import swp.project.adn_backend.enums.ResultStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.ResultDetailsMapper;
import swp.project.adn_backend.repository.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ResultDetailsService {
    private ResultDetailRepository resultDetailRepository;
    private ResultDetailsMapper resultDetailsMapper;
    private SampleRepository sampleRepository;
    private ResultRepository resultRepository;
    private AppointmentRepository appointmentRepository;

    @Autowired
    public ResultDetailsService(ResultDetailRepository resultDetailRepository, ResultDetailsMapper resultDetailsMapper, SampleRepository sampleRepository, ResultRepository resultRepository, AppointmentRepository appointmentRepository) {
        this.resultDetailRepository = resultDetailRepository;
        this.resultDetailsMapper = resultDetailsMapper;
        this.sampleRepository = sampleRepository;
        this.resultRepository = resultRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public ResultDetailResponse CreateResultDetail(long appointmentId) {

        // Tìm sample theo ID
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));

        // Kiểm tra sample có ResultLocus không
        List<ResultLocus> loci = appointment.getResultLoci();
        if (loci == null || loci.isEmpty()) {
            throw new AppException(ErrorCodeUser.NO_RESULT_LOCUS_FOUND_FOR_SAMPLE);
        }

        // Tính combined PI
        double combinedPi = loci.stream()
                .map(ResultLocus::getPi)
                .reduce(1.0, (a, b) -> a * b);

        // Tính xác suất
        double paternityProbability = (combinedPi / (combinedPi + 1)) * 100;

        // Tạo ResultDetail
        ResultDetail resultDetail = new ResultDetail();
        resultDetail.setResultLoci(loci);
        resultDetail.setCombinedPaternityIndex(combinedPi);
        resultDetail.setPaternityProbability(paternityProbability);

        String summary = String.format("Combined PI: %.2f, Probability: %.4f%%", combinedPi, paternityProbability);
        String conclusion = paternityProbability > 99.0
                ? "Trùng khớp quan hệ cha – con sinh học"
                : "Không trùng khớp";

        resultDetail.setResultSummary(summary);
        resultDetail.setConclusion(conclusion);


        // Tạo kết quả
        Result result = new Result();
        result.setCollectionDate(appointment.getPatients().getFirst().getSamples().getLast().getCollectionDate());
        result.setAppointment(appointment);
        result.setResultDate(LocalDate.now());
        result.setResultStatus(ResultStatus.COMPLETED);
        resultRepository.save(result);

        // Gắn result vào resultDetail
        resultDetail.setResult(result);
        resultDetailRepository.save(resultDetail);

        for (Patient patient: appointment.getPatients()){
            patient.setPatientStatus(PatientStatus.COMPLETED);
        }
        return resultDetailsMapper.toResultDetailResponse(resultDetail);
    }

}
