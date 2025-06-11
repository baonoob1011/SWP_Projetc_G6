package swp.project.adn_backend.service.roleService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;
import swp.project.adn_backend.entity.Patient;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.PatientMapper;
import swp.project.adn_backend.repository.PatientRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PatientService {

    PatientMapper patientMapper;
    PatientRepository patientRepository;
    UserRepository userRepository;

    @Autowired
    public PatientService(PatientMapper patientMapper, PatientRepository patientRepository, UserRepository userRepository) {
        this.patientMapper = patientMapper;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    public List<Patient> registerServiceTest(List<PatientRequest> patientRequest
            , Users userBookAppointment, ServiceTest serviceTest) {
        List<Patient> patientList = new ArrayList<>();
        for (PatientRequest request : patientRequest) {
            Patient patient = patientMapper.toPatientRequest(request);
            patient.setCreateAt(LocalDate.now());
            patient.setRole(Roles.PATIENT.name());
            patient.setUsers(userBookAppointment);
            patient.setServiceTest(serviceTest);
            patientList.add(patient);
        }

        userBookAppointment.setPatients(patientList);
        patientRepository.saveAll(patientList);

        // Trả về danh sách bệnh nhân đã được lưu
        return patientList;
    }

}
