package swp.project.adn_backend.service.result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.result.ResultLocusRequest;
import swp.project.adn_backend.dto.request.result.ResultRequest;
import swp.project.adn_backend.dto.response.result.ResultLocusResponse;
import swp.project.adn_backend.dto.response.result.ResultResponse;
import swp.project.adn_backend.entity.ResultAllele;
import swp.project.adn_backend.entity.ResultLocus;
import swp.project.adn_backend.entity.Sample;
import swp.project.adn_backend.enums.AlleleStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.ResultLocusMapper;
import swp.project.adn_backend.mapper.ResultMapper;
import swp.project.adn_backend.repository.ResultLocusRepository;
import swp.project.adn_backend.repository.ResultRepository;
import swp.project.adn_backend.repository.SampleRepository;

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

    @Autowired
    public ResultLocusService(ResultRepository resultRepository,
                              ResultLocusMapper resultLocusMapper,
                              SampleRepository sampleRepository,
                              ResultLocusRepository resultLocusRepository) {
        this.resultRepository = resultRepository;
        this.resultLocusMapper = resultLocusMapper;
        this.sampleRepository = sampleRepository;
        this.resultLocusRepository = resultLocusRepository;
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

    public List<ResultLocusResponse> createResultLocus(long sampleId, List<ResultLocusRequest> inputRequests) {
        // 1. Lấy sample
        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));

        // 2. Gộp allele theo locus
        Map<String, ResultLocusRequest> locusMap = new HashMap<>();

        for (ResultAllele ra : sample.getResultAlleles()) {
            if (ra.getAlleleStatus() == AlleleStatus.DONE) continue;

            String locusKey = ra.getLocus().getLocusName(); // Lấy từ entity Locus
            locusMap.putIfAbsent(locusKey, new ResultLocusRequest());
            ResultLocusRequest req = locusMap.get(locusKey);
            req.setLocusName(locusKey);

            if ("1".equals(ra.getAllelePosition())) {
                req.setAllele1(ra.getAlleleValue());
            } else if ("2".equals(ra.getAllelePosition())) {
                req.setAllele2(ra.getAlleleValue());
            }

            // Đánh dấu là đã dùng (tạm thời, sẽ set DONE sau khi gán vào ResultLocus)
        }

        // 3. Danh sách request đã có đủ allele
        List<ResultLocusRequest> finalRequests = new ArrayList<>(locusMap.values());

        // 4. Mapping sang entity
        List<ResultLocus> resultLocusList = resultLocusMapper.toResultLocus(finalRequests);
        List<ResultLocusResponse> responses = new ArrayList<>();

        for (ResultLocus rl : resultLocusList) {
            rl.setSample(sample);
            rl.setSampleCode(sample.getSampleCode());

            // Kiểm tra dữ liệu đầy đủ
            if (rl.getAllele1() == null || rl.getAllele2() == null) {
                throw new RuntimeException("Thiếu allele cho locus: " + rl.getLocusName());
            }

            // 5. Tính frequency và pi
            double freq1 = lookupFrequency(rl.getAllele1());
            double freq2 = lookupFrequency(rl.getAllele2());

            if (freq1 <= 0 || freq2 <= 0) {
                throw new RuntimeException("Không tìm thấy tần suất cho allele của locus: " + rl.getLocusName());
            }

            double avgFreq = (freq1 + freq2) / 2.0;
            rl.setFrequency(avgFreq);

            double pi = rl.getAllele1().equals(rl.getAllele2())
                    ? 1.0 / freq1
                    : 1.0 / (freq1 + freq2);
            rl.setPi(pi);

            // 6. Gán resultLocus cho các ResultAllele tương ứng
            for (ResultAllele allele : sample.getResultAlleles()) {
                if (allele.getAlleleStatus() == AlleleStatus.DONE) continue;
                if (rl.getLocusName().equalsIgnoreCase(allele.getResultLocus().getLocusName())) {
                    allele.setResultLocus(rl);
                    allele.setAlleleStatus(AlleleStatus.DONE); // đánh dấu là đã xử lý
                }
            }

            // 7. Lưu và map sang response
            resultLocusRepository.save(rl);
            responses.add(resultLocusMapper.toResultLocusResponse(rl));
        }

        return responses;
    }



    private double lookupFrequency(double allele) {
        return alleleFrequencies.getOrDefault(allele, 0.01); // tránh chia cho 0
    }
}

