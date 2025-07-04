package swp.project.adn_backend.service.result;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.InfoDTO.AlleleInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo;
import swp.project.adn_backend.dto.request.result.AllelePairRequest;
import swp.project.adn_backend.dto.request.result.ResultAlleleRequest;
import swp.project.adn_backend.dto.request.result.ResultRequest;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.PatientAppointmentResponse;
import swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult.SampleAppointmentResponse;
import swp.project.adn_backend.dto.response.result.PatientAlleleResponse;
import swp.project.adn_backend.dto.response.result.ResultAlleleResponse;
import swp.project.adn_backend.dto.response.result.ResultResponse;
import swp.project.adn_backend.dto.response.result.SampleAlleleResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.AlleleStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.ResultStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.AppointmentMapper;
import swp.project.adn_backend.mapper.ResultAlleleMapper;
import swp.project.adn_backend.mapper.ResultMapper;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.registerServiceTestService.AllAlleleResponse;

import java.util.ArrayList;
import java.util.List;

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
                                                       long locusId
    ) {

        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SAMPLE_NOT_EXISTS));
        Locus locus = locusRepository.findById(locusId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.LOCUS_NOT_EXISTS));
        List<ResultAlleleResponse> responses = new ArrayList<>();

        ResultAllele allele1 = new ResultAllele();
        allele1.setAlleleValue(request.getAllele1());
        allele1.setAllelePosition("1");
        allele1.setAlleleStatus(request.getAlleleStatus());
        allele1.setSample(sample);
        allele1.setLocus(locus);
        resultAlleleRepository.save(allele1);
        responses.add(resultAlleleMapper.toResultAlleleResponse(allele1));

        ResultAllele allele2 = new ResultAllele();
        allele2.setAlleleValue(request.getAllele2());
        allele2.setAllelePosition("2");
        allele2.setAlleleStatus(request.getAlleleStatus());
        allele2.setSample(sample);
        allele2.setLocus(locus);
        resultAlleleRepository.save(allele2);
        responses.add(resultAlleleMapper.toResultAlleleResponse(allele2));
        System.out.println("Allele1: " + request.getAllele1());  // cần in ra 11.0
        System.out.println("Allele2: " + request.getAllele2());  // cần in ra 12.0
        System.out.println("Status: " + request.getAlleleStatus());    // cần in ra ENTERED

        return responses;
    }

    public AllAlleleResponse getAllAlleleOfSample(long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(()->new AppException(ErrorCodeUser.PATIENT_INFO_NOT_EXISTS));
        PatientAlleleResponse patientAppointmentResponse=appointmentMapper.toPatientAppointmentResponse(patient);
        List<SampleAlleleResponse> sampleAlleleResponse=appointmentMapper.toSampleAlleleResponses(patient.getSamples());
        List<ResultAlleleResponse> resultAlleleResponseList=new ArrayList<>();
        for (ResultAllele resultAllele:patient.getSamples().getFirst().getResultAlleles()){
            ResultAlleleResponse resultAlleleResponse= resultAlleleMapper.toResultAlleleResponse(resultAllele);
            resultAlleleResponseList.add(resultAlleleResponse);
        }
        AllAlleleResponse allAlleleResponse=new AllAlleleResponse();
        allAlleleResponse.setPatientAppointmentResponse(patientAppointmentResponse);
        allAlleleResponse.setSampleAlleleResponse(sampleAlleleResponse);
        allAlleleResponse.setResultAlleleResponse(resultAlleleResponseList);
        return allAlleleResponse;
    }
}
