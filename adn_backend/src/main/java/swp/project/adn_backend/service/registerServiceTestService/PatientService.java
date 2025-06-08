package swp.project.adn_backend.service.registerServiceTestService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;
import swp.project.adn_backend.entity.Patient;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.PatientMapper;
import swp.project.adn_backend.repository.PatientRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.time.LocalDate;
import java.util.Arrays;
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

    public List<Patient> registerServiceTest(PatientRequest patientRequest, Authentication authentication) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userCreated = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        // Bệnh nhân 1
        Patient patient1 = patientMapper.toPatientRequest(patientRequest);
        patient1.setCreateAt(LocalDate.now());
        patient1.setRole(Roles.PATIENT.name());

        // Bệnh nhân 2
        Patient patient2 = patientMapper.toPatientRequest(patientRequest);
        patient2.setCreateAt(LocalDate.now());
        patient2.setRole(Roles.PATIENT.name());

        // Gán người đăng ký cho cả hai bệnh nhân
        patient1.setUsers(userCreated);
        patient2.setUsers(userCreated);

        // Lưu bệnh nhân vào cơ sở dữ liệu
        patientRepository.save(patient1);
        patientRepository.save(patient2);

        // Trả về danh sách bệnh nhân đã được lưu
        return Arrays.asList(patient1, patient2);
    }

}
