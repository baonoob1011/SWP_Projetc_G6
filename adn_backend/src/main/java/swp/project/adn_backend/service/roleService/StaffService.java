package swp.project.adn_backend.service.roleService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.SlotInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo;
import swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.UserInfoDTO;
import swp.project.adn_backend.dto.request.updateRequest.UpdateStaffAndManagerRequest;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.exception.MultiFieldValidationException;
import swp.project.adn_backend.mapper.UserMapper;
import swp.project.adn_backend.repository.StaffRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class StaffService {

    UserRepository userRepository;
    StaffRepository staffRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    EntityManager entityManager;


    @Autowired
    public StaffService(UserRepository userRepository, StaffRepository staffRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, EntityManager entityManager) {
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.entityManager = entityManager;
    }

    public List<StaffBasicInfo> getAllStaffCollectorBasicInfo() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo(" +
                "s.staffId, s.fullName, s.phone, s.email, s.avatarUrl, s.gender, s.idCard, s.address, s.dateOfBirth) FROM Staff s " +
                "Where s.role=:role";
        TypedQuery<StaffBasicInfo> query = entityManager.createQuery(jpql, StaffBasicInfo.class);
        query.setParameter("role", "SAMPLE_COLLECTOR");
        return query.getResultList();
    }

    public List<StaffBasicInfo> getAllCashierAccount() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo(" +
                "s.staffId, s.fullName, s.phone, s.email, s.avatarUrl, s.gender, s.idCard, s.address, s.dateOfBirth) FROM Staff s " +
                "Where s.role=:role";
        TypedQuery<StaffBasicInfo> query = entityManager.createQuery(jpql, StaffBasicInfo.class);
        query.setParameter("role", "CASHIER");
        return query.getResultList();
    }

    public List<StaffBasicInfo> getAllStaffAtHomeBasicInfo() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo(" +
                "s.staffId, s.fullName, s.phone, s.email, s.avatarUrl, s.gender, s.idCard, s.address, s.dateOfBirth) FROM Staff s " +
                "Where s.role=:role";
        TypedQuery<StaffBasicInfo> query = entityManager.createQuery(jpql, StaffBasicInfo.class);
        query.setParameter("role", "STAFF_AT_HOME");
        return query.getResultList();
    }

    public List<StaffBasicInfo> getAllLabTechnicianBasicInfo() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo(" +
                "s.staffId, s.fullName, s.phone, s.email, s.avatarUrl, s.gender, s.idCard, s.address, s.dateOfBirth) FROM Staff s " +
                "Where s.role=:role";
        TypedQuery<StaffBasicInfo> query = entityManager.createQuery(jpql, StaffBasicInfo.class);
        query.setParameter("role", "LAB_TECHNICIAN");
        return query.getResultList();
    }

    public List<StaffBasicInfo> getAllLConsultantBasicInfo() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo(" +
                "s.staffId, s.fullName, s.phone, s.email, s.avatarUrl, s.gender, s.idCard, s.address, s.dateOfBirth) FROM Staff s " +
                "Where s.role=:role";
        TypedQuery<StaffBasicInfo> query = entityManager.createQuery(jpql, StaffBasicInfo.class);
        query.setParameter("role", "CONSULTANT");
        return query.getResultList();
    }

    public List<StaffBasicInfo> getAllStaffBasicInfo() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo(" +
                "s.staffId, s.fullName, s.phone, s.email, s.avatarUrl, s.gender, s.idCard, s.address, s.dateOfBirth) FROM Staff s " +
                "Where s.role=:role";
        TypedQuery<StaffBasicInfo> query = entityManager.createQuery(jpql, StaffBasicInfo.class);
        query.setParameter("role", "STAFF");
        return query.getResultList();
    }
    // update staff

    @Transactional
    public Users updateStaff(Authentication authentication,
                             UpdateStaffAndManagerRequest updateStaffAndManagerRequest) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        validateUpdateStaff(updateStaffAndManagerRequest, existingUser);


        if (updateStaffAndManagerRequest.getOldPassword() != null) {
            if (!passwordEncoder.matches(updateStaffAndManagerRequest.getOldPassword(), existingUser.getPassword())) {
                throw new AppException(ErrorCodeUser.OLD_PASSWORD_NOT_MAPPING);
            }
        }

        // Validate và cập nhật password
        if (updateStaffAndManagerRequest.getPassword() != null && updateStaffAndManagerRequest.getConfirmPassword() != null) {
            if (!passwordEncoder.matches(updateStaffAndManagerRequest.getPassword(), existingUser.getPassword())
                    && updateStaffAndManagerRequest.getConfirmPassword().equals(updateStaffAndManagerRequest.getPassword())) {
                existingUser.setPassword(passwordEncoder.encode(updateStaffAndManagerRequest.getPassword()));
            } else {
                throw new AppException(ErrorCodeUser.PASSWORD_EXISTED);
            }
        }

        // --- Bổ sung validate và cập nhật dateOfBirth ---
        if (updateStaffAndManagerRequest.getDateOfBirth() != null) {
            LocalDate dob = updateStaffAndManagerRequest.getDateOfBirth();
            LocalDate today = LocalDate.now();

            if (!dob.isBefore(today)) {
                throw new AppException(ErrorCodeUser.INVALID_DATE_OF_BIRTH);
            }

        }

        // Cập nhật các trường (giữ nguyên logic cũ)
        if (updateStaffAndManagerRequest.getPhone() != null) {
            existingUser.setPhone(updateStaffAndManagerRequest.getPhone());
        }
        if (updateStaffAndManagerRequest.getEmail() != null) {
            existingUser.setEmail(updateStaffAndManagerRequest.getEmail());
        }
        if (updateStaffAndManagerRequest.getFullName() != null) {
            existingUser.setFullName(updateStaffAndManagerRequest.getFullName());
        }
        if (updateStaffAndManagerRequest.getAddress() != null) {
            existingUser.setAddress(updateStaffAndManagerRequest.getAddress());
        }
        if (updateStaffAndManagerRequest.getGender() != null) {
            existingUser.setGender(updateStaffAndManagerRequest.getGender().trim());
        }
        if (updateStaffAndManagerRequest.getDateOfBirth() != null) {
            existingUser.setDateOfBirth(updateStaffAndManagerRequest.getDateOfBirth());
        }

        return userRepository.save(existingUser);
    }

    @Transactional(readOnly = true)
    public UserInfoDTO findUserByPhone(String phone) {
        Users users = userRepository.findByPhone(phone)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PHONE_NOT_EXISTS));

        String jpql = "Select new swp.project.adn_backend.dto.InfoDTO.UserInfoDTO(" +
                "u.fullName, u.phone, u.email, u.enabled, u.createAt, u.address) " +
                "From Users u Where u.phone=:phone";
        TypedQuery<UserInfoDTO> query = entityManager.createQuery(jpql, UserInfoDTO.class);
        query.setParameter("phone", phone);
        return query.getSingleResult();
    }


    private void validateUpdateStaff(UpdateStaffAndManagerRequest updateStaffAndManagerRequest, Users existingStaff) {
        Map<String, String> errors = new HashMap<>();

        if (!existingStaff.getEmail().equals(updateStaffAndManagerRequest.getEmail()) &&
                staffRepository.existsByEmail(updateStaffAndManagerRequest.getEmail())) {
            errors.put("email", "EMAIL_EXISTED");
        }

        if (!existingStaff.getPhone().equals(updateStaffAndManagerRequest.getPhone()) &&
                staffRepository.existsByPhone(updateStaffAndManagerRequest.getPhone())) {
            errors.put("phone", "PHONE_EXISTED");
        }

        if (!existingStaff.getAddress().equals(updateStaffAndManagerRequest.getAddress()) &&
                staffRepository.existsByAddress(updateStaffAndManagerRequest.getAddress())) {
            errors.put("address", "ADDRESS_EXISTED");
        }

        if (!existingStaff.getIdCard().equals(updateStaffAndManagerRequest.getIdCard()) &&
                staffRepository.existsByIdCard(updateStaffAndManagerRequest.getIdCard())) {
            errors.put("idCard", "ID_CARD_EXISTED");
        }

        // Validate gender
        if (updateStaffAndManagerRequest.getGender() != null) {
            String gender = updateStaffAndManagerRequest.getGender().trim();
            if (!(gender.equalsIgnoreCase("Male") ||
                    gender.equalsIgnoreCase("Female") ||
                    gender.equalsIgnoreCase("Other"))) {
                errors.put("gender", "INVALID_GENDER");
            }
        }

        // Validate dateOfBirth
        if (updateStaffAndManagerRequest.getDateOfBirth() != null) {
            LocalDate dob = updateStaffAndManagerRequest.getDateOfBirth();
            LocalDate today = LocalDate.now();
            if (!dob.isBefore(today)) {
                errors.put("dateOfBirth", "INVALID_DATE_OF_BIRTH");
            }
        }

        if (!errors.isEmpty()) {
            throw new MultiFieldValidationException(errors);
        }
    }
}
