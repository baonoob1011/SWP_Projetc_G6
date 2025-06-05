package swp.project.adn_backend.service.roleService;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
//import jakarta.transaction.Transactional;
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

import swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.UserInfoDTO;
import swp.project.adn_backend.dto.request.ManagerRequest;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.exception.MultiFieldValidationException;
import swp.project.adn_backend.mapper.UserMapper;
import swp.project.adn_backend.repository.ManagerRepository;
import swp.project.adn_backend.repository.StaffRepository;
import swp.project.adn_backend.repository.UserRepository;


import java.util.HashMap;
import java.util.List;
import java.util.Map;


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

        // Lấy thêm roles cho từng user (bạn có thể query thêm entity hoặc cache)
        for (UserInfoDTO userDto : users) {
            Users userEntity = entityManager.createQuery(
                            "SELECT u FROM Users u WHERE u.fullName = :fullName", Users.class)
                    .setParameter("fullName", userDto.getFullName())
                    .getSingleResult();
            userDto.setRoles(userEntity.getRoles());
        }

        return users;
    }


    @Transactional(readOnly = true)
    public List<StaffInfoDTO> getAllStaff() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO(" +
                "u.fullName, u.phone, u.email, u.enabled, u.createAt, u.roles, u.idCard, u.gender, u.address, u.dateOfBirth) " +
                "FROM Users u JOIN u.roles r WHERE r = :input";

        TypedQuery<StaffInfoDTO> query = entityManager.createQuery(jpql, StaffInfoDTO.class);
        query.setParameter("input", "STAFF");

        return query.getResultList();
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
