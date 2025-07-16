package swp.project.adn_backend.service.result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.request.result.ResultLocusRequest;
import swp.project.adn_backend.dto.request.result.ResultRequest;
import swp.project.adn_backend.dto.response.result.ResultDetailResponse;
import swp.project.adn_backend.dto.response.result.ResultLocusResponse;
import swp.project.adn_backend.dto.response.result.ResultResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.*;
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
            Map.entry(6.0, 0.06),
            Map.entry(7.0, 0.05),
            Map.entry(8.0, 0.04),
            Map.entry(9.0, 0.06),
            Map.entry(10.0, 0.07),
            Map.entry(11.0, 0.248),  // ✅ Đã fix theo dữ liệu mẫu bạn muốn
            Map.entry(12.0, 0.180),  // ✅ Dị hợp tử phổ biến
            Map.entry(13.0, 0.100),
            Map.entry(13.2, 0.010),
            Map.entry(14.0, 0.085),
            Map.entry(15.0, 0.070),
            Map.entry(16.0, 0.150),  // ✅ Rất phổ biến
            Map.entry(17.0, 0.050),
            Map.entry(18.0, 0.030),
            Map.entry(19.0, 0.025),
            Map.entry(20.0, 0.020),
            Map.entry(21.0, 0.015),
            Map.entry(22.0, 0.012),
            Map.entry(23.0, 0.010),
            Map.entry(24.0, 0.010),
            Map.entry(25.0, 0.010),
            Map.entry(26.0, 0.010),
            Map.entry(27.0, 0.010),
            Map.entry(28.0, 0.010),
            Map.entry(29.0, 0.010),
            Map.entry(30.0, 0.010),
            Map.entry(31.0, 0.010),
            Map.entry(32.0, 0.010),
            Map.entry(32.2, 0.010),
            Map.entry(33.0, 0.010),
            Map.entry(34.0, 0.010),
            Map.entry(35.0, 0.010),
            Map.entry(36.0, 0.010),
            Map.entry(37.0, 0.010),
            Map.entry(38.0, 0.010),
            Map.entry(39.0, 0.010),
            Map.entry(40.0, 0.010),
            Map.entry(41.0, 0.010),
            Map.entry(42.0, 0.010),
            Map.entry(43.0, 0.010)
    );

    // Dịch vụ tạo ResultLocus và ResultDetail với tính toán PI chính xác
    @Transactional
    public ResultDetailResponse createResultLocusAndDetail(long sampleId1,
                                                           long sampleId2,
                                                           long appointmentId,
                                                           ResultLocusRequest resultLocusRequest) {
        Sample sample1 = sampleRepository.findById(sampleId1)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));

        Sample sample2 = sampleRepository.findById(sampleId2)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));

        if (sample1.getSampleStatus() == SampleStatus.REJECTED || sample2.getSampleStatus() == SampleStatus.REJECTED) {
            throw new RuntimeException("1 trong 2 mẫu này không hợp lệ");
        }

        if (appointment.getAppointmentStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Đơn đăng kí này đã có kết quả");
        }

        Map<String, List<Double>> allele1Map = new HashMap<>();
        Map<String, List<Double>> allele2Map = new HashMap<>();
        Map<String, Long> locusIdMap = new HashMap<>();

        // Lấy VALID allele từ sample 1
        for (ResultAllele ra : sample1.getResultAlleles()) {
            if (ra.getAlleleStatus() != AlleleStatus.VALID) continue;
            String locusName = ra.getLocus().getLocusName();
            allele1Map.computeIfAbsent(locusName, k -> new ArrayList<>()).add(ra.getAlleleValue());
            locusIdMap.put(locusName, ra.getLocus().getLocusId());
        }

        // Lấy VALID allele từ sample 2
        for (ResultAllele ra : sample2.getResultAlleles()) {
            if (ra.getAlleleStatus() != AlleleStatus.VALID) continue;
            String locusName = ra.getLocus().getLocusName();
            allele2Map.computeIfAbsent(locusName, k -> new ArrayList<>()).add(ra.getAlleleValue());
        }

        List<ResultLocus> resultLocusList = new ArrayList<>();

        for (String locusName : allele1Map.keySet()) {
            if (!allele2Map.containsKey(locusName)) continue;

            List<Double> parentAlleles = allele1Map.get(locusName);
            List<Double> childAlleles = allele2Map.get(locusName);

            if (parentAlleles.size() != 2 || childAlleles.size() != 2) continue;

            double father1 = parentAlleles.get(0);
            double father2 = parentAlleles.get(1);
            double child1 = childAlleles.get(0);
            double child2 = childAlleles.get(1);

            double pi = calculatePI(father1, father2, child1, child2);
            double freq1 = lookupFrequency(child1);
            double freq2 = lookupFrequency(child2);

            ResultLocus rl = new ResultLocus();
            rl.setLocusName(locusName);
            rl.setAllele1(child1);
            rl.setAllele2(child2);
            rl.setFatherAllele1(father1);
            rl.setFatherAllele2(father2);
            rl.setFrequency((freq1 + freq2) / 2);
            rl.setPi(pi);
            rl.setAppointment(appointment);
            rl.setSampleCode1(sample1.getSampleCode());
            rl.setSampleCode2(sample2.getSampleCode());

            Locus locus = locusRepository.findById(locusIdMap.get(locusName))
                    .orElseThrow(() -> new AppException(ErrorCodeUser.LOCUS_NOT_FOUND));
            rl.setLocus(locus);

            resultLocusList.add(rl);
        }

        double combinedPi = resultLocusList.stream()
                .map(ResultLocus::getPi)
                .reduce(1.0, (a, b) -> a * b);

        double paternityProbability = (combinedPi / (combinedPi + 1)) * 100;

        ResultDetail resultDetail = new ResultDetail();
        resultDetail.setResultLoci(new ArrayList<>(resultLocusList));
        resultDetail.setCombinedPaternityIndex(combinedPi);
        resultDetail.setPaternityProbability(paternityProbability);
        resultDetail.setResultSummary(String.format("Combined PI: %.2f, Probability: %.4f%%", combinedPi, paternityProbability));
        resultDetail.setConclusion(paternityProbability > 99.0 ? "Trùng khớp quan hệ cha – con sinh học" : "Không trùng khớp");
        resultDetail.setAppointment(appointment);

        Result result = new Result();
        result.setCollectionDate(sample1.getCollectionDate());
        result.setAppointment(appointment);
        result.setResultDate(LocalDate.now());
        result.setResultStatus(ResultStatus.COMPLETED);

        appointment.setAppointmentStatus(AppointmentStatus.WAITING_MANAGER_APPROVAL);
        appointment.setNote("kết quả xét nghiệm đang được xác nhận");


        // Kiểm tra loại dịch vụ để xử lý Slot + Kit
        ServiceTest service = appointment.getServices();
        if (service != null && service.getServiceType() != null) {
            ServiceType type = service.getServiceType();

            if (type == ServiceType.CIVIL) {
                List<CivilService> civilServices = service.getCivilServices();
                if (civilServices != null) {
                    for (CivilService civilService : civilServices) {
                        Set<SampleCollectionMethod> methods = civilService.getSampleCollectionMethods();

                        if (methods.contains(SampleCollectionMethod.AT_CLINIC)) {
                            Slot slot = appointment.getSlot(); // ✅ chỉ gán khi chắc chắn có
                            if (slot != null) {
                                slot.setSlotStatus(SlotStatus.COMPLETED);
                            }
                            // gán nhân viên nếu cần
                            if (slot != null && slot.getStaff() != null) {
                                for (Staff staff : slot.getStaff()) {
                                    if ("SAMPLE_COLLECTOR".equals(staff.getRole())) {
                                        appointment.setStaff(staff);
                                        break;
                                    }
                                }
                            }
                            break;
                        }

                        if (methods.contains(SampleCollectionMethod.AT_HOME)) {
                            if (appointment.getKitDeliveryStatus() != null) {
                                Staff staff=appointment.getKitDeliveryStatus().getStaff();
                                appointment.setStaff(staff);
                                appointment.getKitDeliveryStatus().setDeliveryStatus(DeliveryStatus.COMPLETED);
                                break;
                            }
                        }
                    }
                }
            } else if (type == ServiceType.ADMINISTRATIVE) {
                Slot slot = appointment.getSlot(); // ✅ ADMINISTRATIVE cũng có slot
                if (slot != null) {
                    slot.setSlotStatus(SlotStatus.COMPLETED);
                }
            }
        }


        resultRepository.save(result);
        resultDetail.setResult(result);
        resultDetailRepository.save(resultDetail);

        for (ResultLocus rl : resultLocusList) {
            rl.setResultDetail(resultDetail);
            resultLocusRepository.save(rl);
        }

        for (Patient patient : new ArrayList<>(appointment.getPatients())) {
            patient.setPatientStatus(PatientStatus.COMPLETED);
        }

        return resultDetailsMapper.toResultDetailResponse(resultDetail);
    }


    // Tính PI chuẩn dựa trên quan hệ cha-con
    // Tính PI chuẩn dựa trên quan hệ cha-con
    private double calculatePI(double father1, double father2, double child1, double child2) {
        if (Double.compare(child1, child2) == 0) {
            // Con đồng hợp tử (ví dụ: 11 - 11)
            if (father1 == child1 || father2 == child1) {
                double freq = lookupFrequency(child1);
                return 1.0 / freq;
            }
        } else {
            // Con dị hợp tử (ví dụ: 11 - 12)
            boolean hasChild1 = father1 == child1 || father2 == child1;
            boolean hasChild2 = father1 == child2 || father2 == child2;

            if (hasChild1 && hasChild2) {
                // Cả 2 allele của con đều có trong cha
                double freq1 = lookupFrequency(child1);
                double freq2 = lookupFrequency(child2);
                return 1.0 / (freq1 + freq2);
            } else if (hasChild1 ^ hasChild2) {
                // Chỉ 1 allele trùng cha
                double freq = hasChild1 ? lookupFrequency(child1) : lookupFrequency(child2);
                return 1.0 / (2 * freq); // ✅ Đây là phần đã sửa chuẩn
            }
        }
        return 0.0; // Không có allele nào trùng
    }


    private double lookupFrequency(double allele) {
        return alleleFrequencies.getOrDefault(allele, 0.01); // tránh chia cho 0
    }
}

