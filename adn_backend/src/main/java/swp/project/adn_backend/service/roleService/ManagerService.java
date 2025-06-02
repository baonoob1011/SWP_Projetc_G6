package swp.project.adn_backend.service.roleService;

import jakarta.transaction.Transactional;
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

import swp.project.adn_backend.dto.request.ManagerRequest;
import swp.project.adn_backend.dto.request.StaffRequest;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.Roles;
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
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ManagerService {

    UserRepository userRepository;
    ManagerRepository managerRepository;
    StaffRepository staffRepository;
    PasswordEncoder passwordEncoder;
    UserMapper userMapper;

    @Autowired
    public ManagerService(UserRepository userRepository, ManagerRepository managerRepository, StaffRepository staffRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.managerRepository = managerRepository;
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public Users findUserByPhone(String phone) {
        Users users = userRepository.findByPhone(phone)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PHONE_NOT_EXISTS));
        return users;
    }

    public List<Users> getAllUser() {
        return userRepository.findAll();
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
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
