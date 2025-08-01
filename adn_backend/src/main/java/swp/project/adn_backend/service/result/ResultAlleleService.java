package swp.project.adn_backend.service.result;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.controller.result.ResultAlleleController;
import swp.project.adn_backend.dto.InfoDTO.AlleleInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo;
import swp.project.adn_backend.dto.request.result.AllelePairRequest;
import swp.project.adn_backend.dto.request.result.ResultAlleleRequest;
import swp.project.adn_backend.dto.request.result.ResultRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.PatientAppointmentResponse;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult.SampleAppointmentResponse;
import swp.project.adn_backend.dto.response.result.*;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.AlleleStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.ResultStatus;
import swp.project.adn_backend.enums.SampleStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.AppointmentMapper;
import swp.project.adn_backend.mapper.ResultAlleleMapper;
import swp.project.adn_backend.mapper.ResultMapper;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.registerServiceTestService.AllAlleleResponse;
import swp.project.adn_backend.validator.AlleleValidator;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ResultAlleleService {
    private ResultAlleleRepository resultAlleleRepository;
    private ResultAlleleMapper resultAlleleMapper;
    private SampleRepository sampleRepository;
    private LocusRepository locusRepository;
    private StaffRepository staffRepository;
    private EntityManager entityManager;
    private PatientRepository patientRepository;
    private AppointmentMapper appointmentMapper;

    @Autowired
    public ResultAlleleService(ResultAlleleRepository resultAlleleRepository, ResultAlleleMapper resultAlleleMapper, SampleRepository sampleRepository, LocusRepository locusRepository, StaffRepository staffRepository, EntityManager entityManager, PatientRepository patientRepository, AppointmentMapper appointmentMapper) {
        this.resultAlleleRepository = resultAlleleRepository;
        this.resultAlleleMapper = resultAlleleMapper;
        this.sampleRepository = sampleRepository;
        this.locusRepository = locusRepository;
        this.staffRepository = staffRepository;
        this.entityManager = entityManager;
        this.patientRepository = patientRepository;
        this.appointmentMapper = appointmentMapper;
    }

    @Transactional
    public List<ResultAlleleResponse> createAllelePair(AllelePairRequest request,
                                                       long sampleId,
                                                       long locusId) {

        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));
        if (sample.getSampleStatus().equals(SampleStatus.REJECTED)) {
            throw new RuntimeException("Mẫu này đã bị từ chối.");
        }

        Locus locus = locusRepository.findById(locusId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.LOCUS_NOT_EXISTS));
        String locusName = locus.getLocusName();

        List<ResultAlleleResponse> responses = new ArrayList<>();

        // Locus Response để set vào mỗi allele response
        LocusResponse locusResponse = new LocusResponse();
        locusResponse.setLocusId(locusId);
        locusResponse.setLocusName(locusName);

        // --- Allele 1 ---
        ResultAllele allele1 = new ResultAllele();
        allele1.setAlleleValue(request.getAllele1());
        allele1.setAllelePosition("1");
        allele1.setSample(sample);
        allele1.setLocus(locus);
        allele1.setAlleleStatus(
                AlleleValidator.isValid(locusName, String.valueOf(request.getAllele1()))
                        ? request.getAlleleStatus()
                        : AlleleStatus.INVALID
        );
        resultAlleleRepository.save(allele1);
        ResultAlleleResponse response1 = resultAlleleMapper.toResultAlleleResponse(allele1);
        response1.setLocusResponse(locusResponse);
        responses.add(response1);

        // --- Allele 2 ---
        ResultAllele allele2 = new ResultAllele();
        allele2.setAlleleValue(request.getAllele2());
        allele2.setAllelePosition("2");
        allele2.setSample(sample);
        allele2.setLocus(locus);
        allele2.setAlleleStatus(
                AlleleValidator.isValid(locusName, String.valueOf(request.getAllele2()))
                        ? request.getAlleleStatus()
                        : AlleleStatus.INVALID
        );
        resultAlleleRepository.save(allele2);
        ResultAlleleResponse response2 = resultAlleleMapper.toResultAlleleResponse(allele2);
        response2.setLocusResponse(locusResponse);
        responses.add(response2);

        return responses;
    }

    @Transactional
    public void deleteAllele(long alleleId) {
        ResultAllele allele = resultAlleleRepository.findById(alleleId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.ALLELE_NOT_FOUND));
        allele.setAlleleStatus(AlleleStatus.INVALID);
    }


    @Transactional
    public AllAlleleResponse getAllAlleleOfSample(long patientId) {
        // 1. Tìm thông tin bệnh nhân
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PATIENT_INFO_NOT_EXISTS));

        // 2. Lấy thông tin bệnh nhân, mẫu, v.v.
        PatientAlleleResponse patientAppointmentResponse = appointmentMapper.toPatientAppointmentResponse(patient);
        List<SampleAlleleResponse> sampleAlleleResponse = appointmentMapper.toSampleAlleleResponses(patient.getSamples());

        List<ResultAlleleResponse> resultAlleleResponseList = new ArrayList<>();
        List<LocusResponse> locusResponses = new ArrayList<>();
        Set<Long> addedLocusIds = new HashSet<>();

        // 3. Giả định lấy mẫu đầu tiên của bệnh nhân để duyệt allele
        if (!patient.getSamples().isEmpty()) {
            Sample sample = patient.getSamples().getFirst();
            for (ResultAllele resultAllele : sample.getResultAlleles()) {
                ResultAlleleResponse resultAlleleResponse = resultAlleleMapper.toResultAlleleResponse(resultAllele);

                // Gắn locus vào response
                Locus locus = resultAllele.getLocus();
                if (locus != null) {
                    LocusResponse locusResponse = appointmentMapper.toLocusResponses(locus);
                    resultAlleleResponse.setLocusResponse(locusResponse);
                }

                resultAlleleResponseList.add(resultAlleleResponse);
            }

        }

        // 4. Trả kết quả
        AllAlleleResponse allAlleleResponse = new AllAlleleResponse();
        allAlleleResponse.setPatientAppointmentResponse(patientAppointmentResponse);
        allAlleleResponse.setSampleAlleleResponse(sampleAlleleResponse);
        allAlleleResponse.setResultAlleleResponse(resultAlleleResponseList);
        allAlleleResponse.setLocusResponses(locusResponses);
        return allAlleleResponse;
    }

}
