package swp.project.adn_backend.service.result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.result.ResultLocusRequest;
import swp.project.adn_backend.dto.request.result.ResultRequest;
import swp.project.adn_backend.dto.response.result.ResultLocusResponse;
import swp.project.adn_backend.dto.response.result.ResultResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.AlleleStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.ResultLocusMapper;
import swp.project.adn_backend.mapper.ResultMapper;
import swp.project.adn_backend.repository.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class ResultLocusService {

    private final ResultRepository resultRepository;
    private final ResultLocusMapper resultLocusMapper;
    private final SampleRepository sampleRepository;
    private final ResultLocusRepository resultLocusRepository;
    private ResultAlleleRepository resultAlleleRepository;
    private AppointmentRepository appointmentRepository;

    @Autowired
    public ResultLocusService(ResultRepository resultRepository, ResultLocusMapper resultLocusMapper, SampleRepository sampleRepository, ResultLocusRepository resultLocusRepository, ResultAlleleRepository resultAlleleRepository, AppointmentRepository appointmentRepository) {
        this.resultRepository = resultRepository;
        this.resultLocusMapper = resultLocusMapper;
        this.sampleRepository = sampleRepository;
        this.resultLocusRepository = resultLocusRepository;
        this.resultAlleleRepository = resultAlleleRepository;
        this.appointmentRepository = appointmentRepository;
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

    public List<ResultLocusResponse> createResultLocus(long sampleId1,
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

// Step 2: Map allele1 from sample1 (position 1)
        Map<String, Double> allele1Map = new HashMap<>();
        Map<String, Long> locusIdMap = new HashMap<>();

        for (ResultAllele ra : sample1.getResultAlleles()) {
            if ("1".equals(ra.getAllelePosition().trim())) {
                String locusName = ra.getLocus().getLocusName();
                allele1Map.put(locusName, ra.getAlleleValue());
                locusIdMap.put(locusName, ra.getLocus().getLocusId());
                System.out.printf("[S1] Locus: %s, Position: 1, Value: %.2f\n", locusName, ra.getAlleleValue());
            }
        }

// Step 3: Map allele2 from sample2 (position 2)
        Map<String, Double> allele2Map = new HashMap<>();

        for (ResultAllele ra : sample2.getResultAlleles()) {
            if ("2".equals(ra.getAllelePosition().trim())) {
                String locusName = ra.getLocus().getLocusName();
                allele2Map.put(locusName, ra.getAlleleValue());
                System.out.printf("[S2] Locus: %s, Position: 2, Value: %.2f\n", locusName, ra.getAlleleValue());
            }
        }

// Step 4: Merge by common locus
        List<ResultLocusRequest> resultRequests = new ArrayList<>();

        for (String locusName : allele1Map.keySet()) {
            if (allele2Map.containsKey(locusName)) {
                ResultLocusRequest req = new ResultLocusRequest();
                req.setLocusName(locusName);
                req.setAllele1(allele1Map.get(locusName));
                req.setAllele2(allele2Map.get(locusName));
                req.setLocusId(locusIdMap.get(locusName));

                // Frequency and PI
                double freq1 = lookupFrequency(req.getAllele1());
                double freq2 = lookupFrequency(req.getAllele2());

                if (freq1 <= 0 || freq2 <= 0) {
                    throw new RuntimeException("Không tìm thấy tần suất cho locus: " + locusName);
                }

                double avgFreq = (freq1 + freq2) / 2.0;
                req.setFrequency(avgFreq);
                double pi = req.getAllele1()==(req.getAllele2())
                        ? 1.0 / freq1
                        : 1.0 / (freq1 + freq2);
                req.setPi(pi);

                resultRequests.add(req);

                System.out.printf("[✓] Gộp locus %s với allele1=%.2f và allele2=%.2f\n",
                        locusName, req.getAllele1(), req.getAllele2());
            }
        }

// Step 5: Mapping and save
        List<ResultLocus> resultLocusList = resultLocusMapper.toResultLocus(resultRequests);
        List<ResultLocusResponse> responses = new ArrayList<>();

        for (ResultLocus rl : resultLocusList) {
            rl.setAppointment(appointment);
            resultLocusRepository.save(rl);
            responses.add(resultLocusMapper.toResultLocusResponse(rl));
        }

        System.out.println("✅ Tổng số ResultLocus created: " + responses.size());
        return responses;

    }


    private double lookupFrequency(double allele) {
        return alleleFrequencies.getOrDefault(allele, 0.01); // tránh chia cho 0
    }
}

