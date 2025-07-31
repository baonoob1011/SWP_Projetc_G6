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
    // Tần suất allele theo từng locus (dữ liệu người dùng cung cấp sẵn)
    private static final Map<String, Map<Double, Double>> alleleFrequenciesAsian = new HashMap<>();

    static {
        alleleFrequenciesAsian.put("TH01", Map.of(
                6.0, 0.13, 7.0, 0.122, 8.0, 0.268, 9.0, 0.247, 9.3, 0.187, 10.0, 0.103, 11.0, 0.061));
        alleleFrequenciesAsian.put("D3S1358", Map.of(
                12.0, 0.007, 13.0, 0.122, 14.0, 0.276, 15.0, 0.266, 16.0, 0.199, 17.0, 0.086, 18.0, 0.038));
        alleleFrequenciesAsian.put("vWA", Map.of(
                14.0, 0.034, 15.0, 0.067, 16.0, 0.138, 17.0, 0.226, 18.0, 0.252, 19.0, 0.180, 20.0, 0.079, 21.0, 0.025));
        alleleFrequenciesAsian.put("FGA", Map.of(
                18.0, 0.037, 19.0, 0.061, 20.0, 0.079, 21.0, 0.132, 22.0, 0.156, 23.0, 0.172, 24.0, 0.135, 25.0, 0.093));
        alleleFrequenciesAsian.put("D8S1179", Map.of(
                9.0, 0.014, 10.0, 0.041, 11.0, 0.151, 12.0, 0.286, 13.0, 0.283, 14.0, 0.152, 15.0, 0.072));
        alleleFrequenciesAsian.put("D21S11", Map.of(
                25.0, 0.005, 26.0, 0.012, 27.0, 0.017, 28.0, 0.122, 29.0, 0.224, 30.0, 0.239, 31.0, 0.169,
                32.0, 0.103, 33.2, 0.065, 34.2, 0.044));
        alleleFrequenciesAsian.put("D18S51", Map.of(
                12.0, 0.012, 13.0, 0.036, 14.0, 0.086, 15.0, 0.151, 16.0, 0.206, 17.0, 0.225, 18.0, 0.162, 19.0, 0.122));
        alleleFrequenciesAsian.put("D5S818", Map.of(
                9.0, 0.087, 10.0, 0.224, 11.0, 0.401, 12.0, 0.209, 13.0, 0.079));
        alleleFrequenciesAsian.put("D13S317", Map.of(
                8.0, 0.061, 9.0, 0.182, 10.0, 0.304, 11.0, 0.291, 12.0, 0.113, 13.0, 0.049));
        alleleFrequenciesAsian.put("D7S820", Map.of(
                8.0, 0.062, 9.0, 0.128, 10.0, 0.282, 11.0, 0.317, 12.0, 0.143, 13.0, 0.068));
        alleleFrequenciesAsian.put("D16S539", Map.of(
                9.0, 0.039, 10.0, 0.093, 11.0, 0.281, 12.0, 0.343, 13.0, 0.162, 14.0, 0.082));
        alleleFrequenciesAsian.put("TPOX", Map.of(
                6.0, 0.040, 7.0, 0.121, 8.0, 0.302, 9.0, 0.263, 10.0, 0.172, 11.0, 0.102));
        alleleFrequenciesAsian.put("CSF1PO", Map.of(
                8.0, 0.092, 9.0, 0.183, 10.0, 0.262, 11.0, 0.286, 12.0, 0.131));
        alleleFrequenciesAsian.put("D2S1338", Map.of(
                17.0, 0.030,
                18.0, 0.070,
                19.0, 0.110,
                20.0, 0.160,
                21.0, 0.180,
                22.0, 0.170,
                23.0, 0.140,
                24.0, 0.110
        ));

    }


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

            String cleanLocusName = locusName.trim();
            double pi = calculatePI(cleanLocusName, father1, father2, child1, child2);
            double freq1 = lookupFrequency(cleanLocusName, child1);
            double freq2 = lookupFrequency(cleanLocusName, child2);


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
        if (paternityProbability > 99.9999) {
            paternityProbability = 99.9999;
        }
        ResultDetail resultDetail = new ResultDetail();
        resultDetail.setResultLoci(new ArrayList<>(resultLocusList));
        resultDetail.setCombinedPaternityIndex(combinedPi);
        resultDetail.setPaternityProbability(paternityProbability);
        resultDetail.setResultSummary(String.format("Combined PI: %.10f, Probability: %.10f%%", combinedPi, paternityProbability));
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
                            Slot slot = appointment.getSlot();
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
                                Staff staff = appointment.getKitDeliveryStatus().getStaff();
                                appointment.setStaff(staff);
                                appointment.getKitDeliveryStatus().setDeliveryStatus(DeliveryStatus.COMPLETED);
                                break;
                            }
                        }
                    }
                }
            } else if (type == ServiceType.ADMINISTRATIVE) {
                Slot slot = appointment.getSlot(); //
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


    private double calculatePI(String locusName, double father1, double father2, double child1, double child2) {
        System.out.println("=== DEBUG PI Calculation ===");
        System.out.println("Locus: " + locusName);
        System.out.println("Father alleles: " + father1 + ", " + father2);
        System.out.println("Child alleles: " + child1 + ", " + child2);

        if (Double.compare(child1, child2) == 0) {
            System.out.println("Case: Homozygous child");
            if (father1 == child1 || father2 == child1) {
                double freq = lookupFrequency(locusName, child1);
                System.out.println("Allele match found. Allele: " + child1 + ", Frequency: " + freq);
                System.out.println("PI = 1 / freq = " + (1.0 / freq));
                return 1.0 / freq;
            }
        } else {
            System.out.println("Case: Heterozygous child");
            boolean hasChild1 = father1 == child1 || father2 == child1;
            boolean hasChild2 = father1 == child2 || father2 == child2;

            if (hasChild1 && hasChild2) {
                double freq1 = lookupFrequency(locusName, child1);
                double freq2 = lookupFrequency(locusName, child2);
                double pi = 1.0 / (freq1 + freq2);
                System.out.println("Both alleles match. Allele1: " + child1 + ", Freq1: " + freq1 +
                        ", Allele2: " + child2 + ", Freq2: " + freq2 + ", PI: " + pi);
                return pi;
            } else if (hasChild1 ^ hasChild2) {
                double freq = hasChild1 ? lookupFrequency(locusName, child1) : lookupFrequency(locusName, child2);
                double usedAllele = hasChild1 ? child1 : child2;
                double pi = 1.0 / (2 * freq);
                System.out.println("One allele match. Allele: " + usedAllele + ", Freq: " + freq + ", PI: " + pi);
                return pi;
            }
        }

        System.out.println("No allele match. PI: 0.0");
        return 0.0;
    }

    private double lookupFrequency(String locusName, double allele) {
        Map<Double, Double> freqMap = alleleFrequenciesAsian.get(locusName);
        if (freqMap == null) {
            System.out.println("Locus not found: " + locusName + ". Using default freq 0.01.");
            return 0.01;
        }
        double freq = freqMap.getOrDefault(allele, 0.01);
        if (!freqMap.containsKey(allele)) {
            System.out.println("Allele " + allele + " not found in locus " + locusName + ". Using default freq 0.01.");
        }

        System.out.println("DEBUG - Expected locus: [" + locusName + "]");
        System.out.println("DEBUG - All loaded keys: " + alleleFrequenciesAsian.keySet());
        return freq;
    }



}

