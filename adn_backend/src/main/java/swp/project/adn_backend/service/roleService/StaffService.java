package swp.project.adn_backend.service.roleService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.UserInfoDTO;
import swp.project.adn_backend.dto.request.StaffRequest;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import swp.project.adn_backend.dto.request.updateRequest.UpdateStaffAndManagerRequest;
import swp.project.adn_backend.dto.request.updateRequest.UpdateUserRequest;
=======
import swp.project.adn_backend.dto.request.UpdateRequest.UpdateUserRequest;
>>>>>>> Stashed changes
=======
import swp.project.adn_backend.dto.request.UpdateRequest.UpdateUserRequest;
>>>>>>> Stashed changes
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
import java.time.Period;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
<<<<<<< Updated upstream
<<<<<<< Updated upstream
@Builder
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    }


    // update staff

    @Transactional
    public Users updateStaff(Authentication authentication, UpdateStaffAndManagerRequest updateStaffAndManagerRequest) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        validateUpdateStaff(updateStaffAndManagerRequest, existingUser);


        // Validate và cập nhật password
        if (updateStaffAndManagerRequest.getPassword() != null) {
            if (updateStaffAndManagerRequest.getOldPassword() == null ||
                    !passwordEncoder.matches(updateStaffAndManagerRequest.getOldPassword(), existingUser.getPassword())) {
                throw new AppException(ErrorCodeUser.OLD_PASSWORD_NOT_MAPPING);
            }

            if (!passwordEncoder.matches(updateStaffAndManagerRequest.getPassword(), existingUser.getPassword())) {
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
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    }

    @Transactional(readOnly = true)
    public UserInfoDTO findUserByPhone(String phone) {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.UserInfoDTO(" +
                "u.fullName, u.phone, u.email, u.enabled, u.createAt, u.address) " +
                "FROM Users u WHERE u.phone = :phone";

        TypedQuery<UserInfoDTO> query = entityManager.createQuery(jpql, UserInfoDTO.class);
        query.setParameter("phone", phone);

        UserInfoDTO userInfoDTO = query.getSingleResult();

        // Lấy roles riêng biệt
        List<String> rolesList = entityManager.createQuery(
                        "SELECT r FROM Users u JOIN u.roles r WHERE u.phone = :phone", String.class)
                .setParameter("phone", phone)
                .getResultList();
        userInfoDTO.setRoles(new HashSet<>(rolesList));

        return userInfoDTO;
    }
    @Transactional
    public Staff updateStaffById(Authentication authentication, UpdateUserRequest updateUserRequest) {
<<<<<<< Updated upstream
=======
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Staff existingStaff = staffRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        if (updateUserRequest.getPhone() != null &&
                !updateUserRequest.getPhone().equals(existingStaff.getPhone()) &&
                staffRepository.existsByPhone(updateUserRequest.getPhone())) {
            throw new AppException(ErrorCodeUser.PHONE_EXISTED);
        }
        if (updateUserRequest.getEmail() != null &&
                !updateUserRequest.getEmail().equals(existingStaff.getEmail()) &&
                staffRepository.existsByEmail(updateUserRequest.getEmail())) {
            throw new AppException(ErrorCodeUser.EMAIL_EXISTED);
        }
        if (updateUserRequest.getIdCard() != null &&
                staffRepository.existsByIdCard(updateUserRequest.getIdCard())) {
            throw new AppException(ErrorCodeUser.ID_CARD_EXISTED); // Bạn cần định nghĩa lỗi này
        }
        if (updateUserRequest.getPassword() != null) {
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
            if (!passwordEncoder.matches(updateUserRequest.getPassword(), existingStaff.getPassword())) {
                throw new AppException(ErrorCodeUser.PASSWORD_EXISTED); // Bạn cần định nghĩa lỗi này
            }
        }
        // Cập nhật mật khẩu nếu có
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        if (updateUserRequest.getPassword() != null) {
            if (updateUserRequest.getOldPassword() == null ||
                    !passwordEncoder.matches(updateUserRequest.getOldPassword(), existingStaff.getPassword())) {
                throw new AppException(ErrorCodeUser.OLD_PASSWORD_NOT_MAPPING);
            }
            existingStaff.setPassword(passwordEncoder.encode(updateUserRequest.getPassword()));
        }

        if (updateUserRequest.getPhone() != null) {
            existingStaff.setPhone(updateUserRequest.getPhone());
        }
        if (updateUserRequest.getEmail() != null) {
            existingStaff.setEmail(updateUserRequest.getEmail());
        }
        if (updateUserRequest.getFullName() != null) {
            existingStaff.setFullName(updateUserRequest.getFullName());
        }
        if (updateUserRequest.getGender() != null) {
            existingStaff.setGender(updateUserRequest.getGender());
        }
        if (updateUserRequest.getAddress() != null) {
            existingStaff.setAddress(updateUserRequest.getAddress());
        }
        if (updateUserRequest.getDateOfBirth() != null) {
            existingStaff.setDateOfBirth(updateUserRequest.getDateOfBirth());
        }
        if (updateUserRequest.getIdCard() != null) {
            existingStaff.setIdCard(updateUserRequest.getIdCard());
        }

        return staffRepository.save(existingStaff);
    }

    private void validateUpdateStaff(StaffRequest staffRequest, Authentication authentication) {
        Map<String, String> errors = new HashMap<>();
>>>>>>> Stashed changes
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Staff existingStaff = staffRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        if (updateUserRequest.getPhone() != null &&
                !updateUserRequest.getPhone().equals(existingStaff.getPhone()) &&
                staffRepository.existsByPhone(updateUserRequest.getPhone())) {
            throw new AppException(ErrorCodeUser.PHONE_EXISTED);
        }
        if (updateUserRequest.getEmail() != null &&
                !updateUserRequest.getEmail().equals(existingStaff.getEmail()) &&
                staffRepository.existsByEmail(updateUserRequest.getEmail())) {
            throw new AppException(ErrorCodeUser.EMAIL_EXISTED);
        }
        if (updateUserRequest.getIdCard() != null &&
                staffRepository.existsByIdCard(updateUserRequest.getIdCard())) {
            throw new AppException(ErrorCodeUser.ID_CARD_EXISTED); // Bạn cần định nghĩa lỗi này
        }
        if (updateUserRequest.getPassword() != null) {
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
            if (!passwordEncoder.matches(updateUserRequest.getPassword(), existingStaff.getPassword())) {
                throw new AppException(ErrorCodeUser.PASSWORD_EXISTED); // Bạn cần định nghĩa lỗi này
            }
        }
        // Cập nhật mật khẩu nếu có
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        if (updateUserRequest.getPassword() != null) {
            if (updateUserRequest.getOldPassword() == null ||
                    !passwordEncoder.matches(updateUserRequest.getOldPassword(), existingStaff.getPassword())) {
                throw new AppException(ErrorCodeUser.OLD_PASSWORD_NOT_MAPPING);
            }
            existingStaff.setPassword(passwordEncoder.encode(updateUserRequest.getPassword()));
        }

        if (updateUserRequest.getPhone() != null) {
            existingStaff.setPhone(updateUserRequest.getPhone());
        }
        if (updateUserRequest.getEmail() != null) {
            existingStaff.setEmail(updateUserRequest.getEmail());
        }
        if (updateUserRequest.getFullName() != null) {
            existingStaff.setFullName(updateUserRequest.getFullName());
        }
        if (updateUserRequest.getGender() != null) {
            existingStaff.setGender(updateUserRequest.getGender());
        }
        if (updateUserRequest.getAddress() != null) {
            existingStaff.setAddress(updateUserRequest.getAddress());
        }
        if (updateUserRequest.getDateOfBirth() != null) {
            existingStaff.setDateOfBirth(updateUserRequest.getDateOfBirth());
        }
        if (updateUserRequest.getIdCard() != null) {
            existingStaff.setIdCard(updateUserRequest.getIdCard());
        }

        return staffRepository.save(existingStaff);
    }

    private void validateUpdateStaff(UpdateStaffAndManagerRequest updateStaffAndManagerRequest,Users existingStaff) {
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
