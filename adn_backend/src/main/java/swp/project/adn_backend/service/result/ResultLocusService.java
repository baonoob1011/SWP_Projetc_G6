package swp.project.adn_backend.service.result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.result.ResultLocusRequest;
import swp.project.adn_backend.dto.request.result.ResultRequest;
import swp.project.adn_backend.dto.response.result.ResultDetailResponse;
import swp.project.adn_backend.dto.response.result.ResultLocusResponse;
import swp.project.adn_backend.dto.response.result.ResultResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.AlleleStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.PatientStatus;
import swp.project.adn_backend.enums.ResultStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.ResultDetailsMapper;
import swp.project.adn_backend.mapper.ResultLocusMapper;
import swp.project.adn_backend.mapper.ResultMapper;
import swp.project.adn_backend.repository.*;

import java.time.LocalDate;
import java.util.*;


@Service
public class ResultLocusService {

    private final ResultRepository resultRepository;
    private final ResultLocusMapper resultLocusMapper;
    private final SampleRepository sampleRepository;
    private final ResultLocusRepository resultLocusRepository;
    private ResultAlleleRepository resultAlleleRepository;
    private AppointmentRepository appointmentRepository;
    private LocusRepository locusRepository;
    private ResultDetailRepository resultDetailRepository;
    private ResultDetailsMapper resultDetailsMapper;


    @Autowired
    public ResultLocusService(ResultRepository resultRepository, ResultLocusMapper resultLocusMapper, SampleRepository sampleRepository, ResultLocusRepository resultLocusRepository, ResultAlleleRepository resultAlleleRepository, AppointmentRepository appointmentRepository, LocusRepository locusRepository, ResultDetailRepository resultDetailRepository, ResultDetailsMapper resultDetailsMapper) {
        this.resultRepository = resultRepository;
        this.resultLocusMapper = resultLocusMapper;
        this.sampleRepository = sampleRepository;
        this.resultLocusRepository = resultLocusRepository;
        this.resultAlleleRepository = resultAlleleRepository;
        this.appointmentRepository = appointmentRepository;
        this.locusRepository = locusRepository;
        this.resultDetailRepository = resultDetailRepository;
        this.resultDetailsMapper = resultDetailsMapper;
    }

    // Tần suất alen mẫu (có thể thay bằng dữ liệu từ DB hoặc file cấu hình)
    private static final Map<Double, Double> alleleFrequencies = Map.ofEntries(
            Map.entry(6.0, 0.08),
            Map.entry(7.0, 0.07),
            Map.entry(8.0, 0.06),
            Map.entry(9.0, 0.07),
            Map.entry(10.0, 0.09),
            Map.entry(11.0, 0.12),
            Map.entry(12.0, 0.13),
            Map.entry(13.0, 0.10),
            Map.entry(13.2, 0.01),
            Map.entry(14.0, 0.08),
            Map.entry(15.0, 0.07),
            Map.entry(16.0, 0.05),
            Map.entry(17.0, 0.04),
            Map.entry(18.0, 0.03),
            Map.entry(19.0, 0.02),
            Map.entry(20.0, 0.01),
            Map.entry(21.0, 0.01),
            Map.entry(22.0, 0.01),
            Map.entry(23.0, 0.01),
            Map.entry(24.0, 0.01),
            Map.entry(25.0, 0.01),
            Map.entry(26.0, 0.01),
            Map.entry(27.0, 0.01),
            Map.entry(28.0, 0.01),
            Map.entry(29.0, 0.01),
            Map.entry(30.0, 0.01),
            Map.entry(31.0, 0.01),
            Map.entry(32.0, 0.01),
            Map.entry(32.2, 0.01),
            Map.entry(33.0, 0.01),
            Map.entry(34.0, 0.01),
            Map.entry(35.0, 0.01),
            Map.entry(36.0, 0.01),
            Map.entry(37.0, 0.01),
            Map.entry(38.0, 0.01),
            Map.entry(39.0, 0.01),
            Map.entry(40.0, 0.01),
            Map.entry(41.0, 0.01),
            Map.entry(42.0, 0.01),
            Map.entry(43.0, 0.01)
    );

    public ResultDetailResponse createResultLocusAndDetail(long sampleId1,
                                                           long sampleId2,
                                                           long appointmentId,
                                                           ResultLocusRequest resultLocusRequest) {

        // Step 1: Load samples and appointment
        Sample sample1 = sampleRepository.findById(sampleId1)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));
        Sample sample2 = sampleRepository.findById(sampleId2)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));

        // Step 2: Map allele1
        Map<String, Double> allele1Map = new HashMap<>();
        Map<String, Long> locusIdMap = new HashMap<>();

        for (ResultAllele ra : sample1.getResultAlleles()) {
            if ("1".equals(ra.getAllelePosition().trim())) {
                String locusName = ra.getLocus().getLocusName();
                allele1Map.put(locusName, ra.getAlleleValue());
                locusIdMap.put(locusName, ra.getLocus().getLocusId());
            }
        }

        // Step 3: Map allele2
        Map<String, Double> allele2Map = new HashMap<>();

        for (ResultAllele ra : sample2.getResultAlleles()) {
            if ("2".equals(ra.getAllelePosition().trim())) {
                String locusName = ra.getLocus().getLocusName();
                allele2Map.put(locusName, ra.getAlleleValue());
            }
        }

        // Step 4: Tạo danh sách ResultLocus
        List<ResultLocus> resultLocusList = new ArrayList<>();

        for (String locusName : allele1Map.keySet()) {
            if (allele2Map.containsKey(locusName)) {
                double allele1 = allele1Map.get(locusName);
                double allele2 = allele2Map.get(locusName);
                long locusId = locusIdMap.get(locusName);

                double freq1 = lookupFrequency(allele1);
                double freq2 = lookupFrequency(allele2);
                if (freq1 <= 0 || freq2 <= 0) {
                    throw new RuntimeException("Không tìm thấy tần suất cho locus: " + locusName);
                }

                double avgFreq = (freq1 + freq2) / 2.0;
                double pi = allele1 == allele2 ? 1.0 / freq1 : 1.0 / (freq1 + freq2);

                ResultLocus rl = new ResultLocus();
                rl.setLocusName(locusName);
                rl.setAllele1(allele1);
                rl.setAllele2(allele2);
                rl.setFrequency(avgFreq);
                rl.setPi(pi);
                rl.setAppointment(appointment);
                rl.setSampleCode1(sample1.getSampleCode());
                rl.setSampleCode2(sample2.getSampleCode());

                Locus locus = locusRepository.findById(locusId)
                        .orElseThrow(() -> new AppException(ErrorCodeUser.LOCUS_NOT_FOUND));
                rl.setLocus(locus);

                resultLocusList.add(rl);
            }
        }

        // Step 5: Tính toán ResultDetail từ ResultLocus
        double combinedPi = resultLocusList.stream()
                .map(ResultLocus::getPi)
                .reduce(1.0, (a, b) -> a * b);
        double paternityProbability = (combinedPi / (combinedPi + 1)) * 100;

        ResultDetail resultDetail = new ResultDetail();
        resultDetail.setResultLoci(new ArrayList<>(resultLocusList)); // tránh lỗi modify khi gán
        resultDetail.setCombinedPaternityIndex(combinedPi);
        resultDetail.setPaternityProbability(paternityProbability);

        String summary = String.format("Combined PI: %.2f, Probability: %.4f%%", combinedPi, paternityProbability);
        String conclusion = paternityProbability > 99.0
                ? "Trùng khớp quan hệ cha – con sinh học"
                : "Không trùng khớp";
        resultDetail.setResultSummary(summary);
        resultDetail.setConclusion(conclusion);

        // Step 6: Tạo kết quả Result
        Result result = new Result();
        result.setCollectionDate(sample1.getCollectionDate());
        result.setAppointment(appointment);
        result.setResultDate(LocalDate.now());
        result.setResultStatus(ResultStatus.COMPLETED);
        resultRepository.save(result);

        // Gắn Result vào Detail và lưu
        resultDetail.setResult(result);
        resultDetail.setAppointment(appointment);
        resultDetailRepository.save(resultDetail);

        // Step 7: Gắn Detail vào từng Locus rồi lưu (dùng bản sao)
        List<ResultLocus> copyLoci = new ArrayList<>(resultLocusList);
        for (ResultLocus rl : copyLoci) {
            rl.setResultDetail(resultDetail);
            resultLocusRepository.save(rl);
        }

        // Step 8: Cập nhật trạng thái bệnh nhân (dùng bản sao)
        List<Patient> patientList = new ArrayList<>(appointment.getPatients());
        for (Patient patient : patientList) {
            patient.setPatientStatus(PatientStatus.COMPLETED);
        }

        return resultDetailsMapper.toResultDetailResponse(resultDetail);
    }





    private double lookupFrequency(double allele) {
        return alleleFrequencies.getOrDefault(allele, 0.01); // tránh chia cho 0
    }
}

