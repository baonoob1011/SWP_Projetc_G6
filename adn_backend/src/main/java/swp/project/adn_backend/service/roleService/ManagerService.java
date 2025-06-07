package swp.project.adn_backend.service.roleService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
//import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.UserInfoDTO;
import swp.project.adn_backend.dto.request.ManagerRequest;
import swp.project.adn_backend.dto.request.UpdateRequest.UpdateUserRequest;
import swp.project.adn_backend.entity.Manager;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.exception.MultiFieldValidationException;
import swp.project.adn_backend.mapper.ManagerMapper;
import swp.project.adn_backend.mapper.UserMapper;
import swp.project.adn_backend.repository.ManagerRepository;
import swp.project.adn_backend.repository.StaffRepository;
import swp.project.adn_backend.repository.UserRepository;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ManagerService {

    UserRepository userRepository;
    ManagerRepository managerRepository;
    StaffRepository staffRepository;
    PasswordEncoder passwordEncoder;
    UserMapper userMapper;
    EntityManager entityManager;

    @Autowired
    public ManagerService(UserRepository userRepository, ManagerRepository managerRepository, StaffRepository staffRepository, PasswordEncoder passwordEncoder, UserMapper userMapper, EntityManager entityManager) {
        this.userRepository = userRepository;
        this.managerRepository = managerRepository;
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public Users findUserByPhone(String phone) {
        Users users = userRepository.findByPhone(phone)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PHONE_NOT_EXISTS));
        return users;
    }

//    @Transactional(readOnly = true)
//    public List<Users> getAllUser() {
//        return userRepository.findAll();
//    }

    @Transactional(readOnly = true)
    public List<UserInfoDTO> getAllUser() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.UserInfoDTO(" +
                "u.fullName, u.phone, u.email, u.enabled, u.createAt) " +
                "FROM Users u JOIN u.roles r WHERE r = :input";

        TypedQuery<UserInfoDTO> query = entityManager.createQuery(jpql, UserInfoDTO.class);
        query.setParameter("input", "USER");

        List<UserInfoDTO> users = query.getResultList();

        for (UserInfoDTO userDto : users) {
            List<Users> matchedUsers = entityManager.createQuery(
                            "SELECT u FROM Users u WHERE u.fullName = :fullName", Users.class)
                    .setParameter("fullName", userDto.getFullName())
                    .getResultList();

            if (!matchedUsers.isEmpty()) {
                userDto.setRoles(matchedUsers.get(0).getRoles());
            }
        }

        return users;
    }

    @Transactional(readOnly = true)
    public List<StaffInfoDTO> getAllStaff() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO(" +
                "u.fullName, u.phone, u.email, u.enabled, u.createAt, u.role, u.idCard, u.gender, u.address, u.dateOfBirth) " +
                "FROM Staff u WHERE u.role = :input";

        TypedQuery<StaffInfoDTO> query = entityManager.createQuery(jpql, StaffInfoDTO.class);
        query.setParameter("input", "STAFF");

        return query.getResultList();
    }

    @Transactional
    public Manager updateManagerById(Authentication authentication, UpdateUserRequest updateUserRequest) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");


        Manager existingManager = managerRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        if (updateUserRequest.getPhone() != null &&
                !updateUserRequest.getPhone().equals(existingManager.getPhone()) &&
                managerRepository.existsByPhone(updateUserRequest.getPhone())) {
            throw new AppException(ErrorCodeUser.PHONE_EXISTED);
        }
        if (updateUserRequest.getEmail() != null &&
                !updateUserRequest.getEmail().equals(existingManager.getEmail()) &&
                managerRepository.existsByEmail(updateUserRequest.getEmail())) {
            throw new AppException(ErrorCodeUser.EMAIL_EXISTED);
        }
        if (updateUserRequest.getIdCard() != null &&
                managerRepository.existsByIdCard(updateUserRequest.getIdCard())) {
            throw new AppException(ErrorCodeUser.ID_CARD_EXISTED); // Bạn cần định nghĩa lỗi này
        }
        if (updateUserRequest.getPassword() != null) {
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
            if (!passwordEncoder.matches(updateUserRequest.getPassword(), existingManager.getPassword())) {
                throw new AppException(ErrorCodeUser.PASSWORD_EXISTED); // Bạn cần định nghĩa lỗi này
            }
        }
        // Cập nhật mật khẩu nếu có
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        if (updateUserRequest.getPassword() != null) {
            if (updateUserRequest.getOldPassword() == null ||
                    !passwordEncoder.matches(updateUserRequest.getOldPassword(), existingManager.getPassword())) {
                throw new AppException(ErrorCodeUser.OLD_PASSWORD_NOT_MAPPING);
            }
            existingManager.setPassword(passwordEncoder.encode(updateUserRequest.getPassword()));
        }

        if (updateUserRequest.getPhone() != null) {
            existingManager.setPhone(updateUserRequest.getPhone());
        }
        if (updateUserRequest.getEmail() != null) {
            existingManager.setEmail(updateUserRequest.getEmail());
        }
        if (updateUserRequest.getFullName() != null) {
            existingManager.setFullName(updateUserRequest.getFullName());
        }
        if (updateUserRequest.getGender() != null) {
            existingManager.setGender(updateUserRequest.getGender());
        }
        if (updateUserRequest.getAddress() != null) {
            existingManager.setAddress(updateUserRequest.getAddress());
        }
        if (updateUserRequest.getDateOfBirth() != null) {
            existingManager.setDateOfBirth(updateUserRequest.getDateOfBirth());
        }
        if (updateUserRequest.getIdCard() != null) {
            existingManager.setIdCard(updateUserRequest.getIdCard());
        }

        return managerRepository.save(existingManager);
    }


    @Transactional
    public void deleteUserByPhone(String phone) {
        Users users = userRepository.findByPhone(phone)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PHONE_NOT_EXISTS));

        userRepository.delete(users);
    }

    @Transactional
    public void deleteStaffByPhone(String phone) {
        Users staff = userRepository.findByPhone(phone)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PHONE_NOT_EXISTS));

        userRepository.delete(staff);
    }

    @Transactional
    public Users updateManager(ManagerRequest managerRequest, Authentication authentication) {
        validateUpdateManager(managerRequest, authentication);
        Users manager = userMapper.toManager(managerRequest);
        return userRepository.save(manager);

    }


    private void validateUpdateManager(ManagerRequest managerRequest, Authentication authentication) {
        Map<String, String> errors = new HashMap<>();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");
        Staff existingStaff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));


        if (!existingStaff.getUsername().equals(managerRequest.getUsername()) &&
                staffRepository.existsByUsername(managerRequest.getUsername())) {
            errors.put("username", "USER_EXISTED");
        }

        if (!existingStaff.getEmail().equals(managerRequest.getEmail()) &&
                staffRepository.existsByEmail(managerRequest.getEmail())) {
            errors.put("email", "EMAIL_EXISTED");
        }

        if (!existingStaff.getPhone().equals(managerRequest.getPhone()) &&
                staffRepository.existsByPhone(managerRequest.getPhone())) {
            errors.put("phone", "PHONE_EXISTED");
        }
        if (!existingStaff.getAddress().equals(managerRequest.getAddress()) &&
                staffRepository.existsByAddress(managerRequest.getAddress())) {
            errors.put("address", "ADDRESS_EXISTED");
        }
        if (!existingStaff.getIdCard().equals(managerRequest.getIdCard()) &&
                staffRepository.existsByAddress(managerRequest.getIdCard())) {
            errors.put("id card", "ID_CART_EXISTED");
        }
        if (!errors.isEmpty()) {
            throw new MultiFieldValidationException(errors);
        }
    }

}
