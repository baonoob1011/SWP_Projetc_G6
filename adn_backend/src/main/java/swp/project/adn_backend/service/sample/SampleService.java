package swp.project.adn_backend.service.sample;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.sample.SampleRequest;
import swp.project.adn_backend.dto.response.sample.SampleResponse;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.SampleStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.SampleMapper;
import swp.project.adn_backend.repository.*;

import java.time.LocalDate;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SampleService {
    SampleRepository sampleRepository;
    SampleMapper sampleMapper;
    PatientRepository patientRepository;
    StaffRepository staffRepository;
    ServiceTestRepository serviceTestRepository;
    AppointmentRepository appointmentRepository;

    @Autowired
    public SampleService(SampleRepository sampleRepository, SampleMapper sampleMapper, PatientRepository patientRepository, StaffRepository staffRepository, ServiceTestRepository serviceTestRepository, AppointmentRepository appointmentRepository) {
        this.sampleRepository = sampleRepository;
        this.sampleMapper = sampleMapper;
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.serviceTestRepository = serviceTestRepository;
        this.appointmentRepository = appointmentRepository;
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
                .orElseThrow(() -> new AppException(ErrorCodeUser.PAYMENT_INFO_NOT_EXISTS));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.APPOINTMENT_NOT_EXISTS));

        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));
        Sample sample = sampleMapper.toSample(sampleRequest);
        sample.setSampleStatus(SampleStatus.COLLECTED);
        sample.setCollectionDate(LocalDate.now());
        sample.setPatient(patient);
        sample.setStaff(staff);
        sample.setKit(serviceTest.getKit());
        sample.setAppointment(appointment);
        SampleResponse response = sampleMapper.toSampleResponse(sampleRepository.save(sample));
        return response;
    }

    // thực làm update status collectSample
}
