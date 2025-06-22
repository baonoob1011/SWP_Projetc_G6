package swp.project.adn_backend.service.sample;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.sample.SampleRequest;
import swp.project.adn_backend.dto.response.sample.*;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.PatientStatus;
import swp.project.adn_backend.enums.SampleStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.AllSampleResponseMapper;
import swp.project.adn_backend.mapper.AppointmentMapper;
import swp.project.adn_backend.mapper.SampleMapper;
import swp.project.adn_backend.mapper.StaffMapper;
import swp.project.adn_backend.repository.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SampleService {
    SampleRepository sampleRepository;
    SampleMapper sampleMapper;
    PatientRepository patientRepository;
    StaffRepository staffRepository;
    ServiceTestRepository serviceTestRepository;
    AppointmentRepository appointmentRepository;
    StaffMapper staffMapper;
    AllSampleResponseMapper allSampleResponseMapper;
    AppointmentMapper appointmentMapper;

    @Autowired
    public SampleService(SampleRepository sampleRepository, SampleMapper sampleMapper, PatientRepository patientRepository, StaffRepository staffRepository, ServiceTestRepository serviceTestRepository, AppointmentRepository appointmentRepository, StaffMapper staffMapper, AllSampleResponseMapper allSampleResponseMapper, AppointmentMapper appointmentMapper) {
        this.sampleRepository = sampleRepository;
        this.sampleMapper = sampleMapper;
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.serviceTestRepository = serviceTestRepository;
        this.appointmentRepository = appointmentRepository;
        this.staffMapper = staffMapper;
        this.allSampleResponseMapper = allSampleResponseMapper;
        this.appointmentMapper = appointmentMapper;
    }

    public SampleResponse collectSample(long patientId,
                                        long serviceId,
                                        long appointmentId,
                                        SampleRequest sampleRequest,
                                        Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PATIENT_INFO_NOT_EXISTS));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        Sample sample = sampleMapper.toSample(sampleRequest);
        sample.setSampleStatus(SampleStatus.COLLECTED);
        sample.setCollectionDate(LocalDate.now());
        sample.setSampleCode(generateSampleCode());
        sample.setPatient(patient);
        sample.setStaff(staff);
        sample.setKit(serviceTest.getKit());
        sample.setAppointment(appointment);
        patient.setPatientStatus(PatientStatus.SAMPLE_COLLECTED);
        SampleResponse response = sampleMapper.toSampleResponse(sampleRepository.save(sample));
        return response;
    }

    public String generateSampleCode() {
        char firstChar = (char) ('A' + new Random().nextInt(26));
        int numberPart = new Random().nextInt(10000);
        char lastChar = (char) ('A' + new Random().nextInt(26));
        return String.format("%c%04d%c", firstChar, numberPart, lastChar);
    }

    public List<AllSampleResponse> getAllSampleOfPatient(Authentication authentication,
                                                         long appointmentId) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));
        List<Sample> sampleList = appointment.getStaff().getSamples();
        List<AllSampleResponse> allSampleResponseList = new ArrayList<>();
        for (Sample sample : sampleList) {

            SampleResponse sampleResponse = sampleMapper.toSampleResponse(sample);
            StaffSampleResponse staffSampleResponse = allSampleResponseMapper.toStaffSampleResponse(sample.getStaff());
            PatientSampleResponse patientSampleResponse = allSampleResponseMapper.toPatientSampleResponse(sample.getPatient());
            AppointmentSampleResponse appointmentSampleResponse = appointmentMapper.toAppointmentSampleResponse(appointment);
            AllSampleResponse allSampleResponse = new AllSampleResponse();
            allSampleResponse.setAppointmentSampleResponse(appointmentSampleResponse);
            allSampleResponse.setSampleResponse(sampleResponse);
            allSampleResponse.setStaffSampleResponse(staffSampleResponse);
            allSampleResponse.setPatientSampleResponse(patientSampleResponse);
            allSampleResponseList.add(allSampleResponse);
        }
        return allSampleResponseList;
    }
    // thực làm update status collectSample

}
