package swp.project.adn_backend.service.roleService;

import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;
import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.ManagerRequest;
import swp.project.adn_backend.dto.request.StaffRequest;
import swp.project.adn_backend.dto.request.UserRequest;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.exception.MultiFieldValidationException;
import swp.project.adn_backend.mapper.UserMapper;
import swp.project.adn_backend.repository.UserRepository;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;


@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    EntityManager entityManager;


    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, EntityManager entityManager) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.entityManager = entityManager;
    }

    // Đăng ký User
    public Users registerUserAccount(UserRequest userDTO) {
        HashSet<String> roles = new HashSet<>();
        validateUser(userDTO);
        // Tạo user từ DTO và mã hóa mật khẩu
        Users users = userMapper.toUser(userDTO);
        roles.add(Roles.USER.name());
        users.setRoles(roles);

        users.setCreateAt(LocalDate.now());
        users.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        // Lưu lại để cascade lưu role
        return userRepository.save(users);
    }

    public Users registerStaffAccount(StaffRequest staffRequest) {
        HashSet<String> roles = new HashSet<>();
        validateStaff(staffRequest);
        // Tạo user từ DTO và mã hóa mật khẩu
        Users users = userMapper.toStaff(staffRequest);
        roles.add(Roles.STAFF.name());
        users.setRoles(roles);
        users.setCreateAt(LocalDate.now());
        users.setPassword(passwordEncoder.encode(staffRequest.getPassword()));
        // Lưu lại để cascade lưu role
        return userRepository.save(users);
    }

    public Users registerManagerAccount(ManagerRequest managerRequest) {
        HashSet<String> roles = new HashSet<>();

        validateManager(managerRequest);
        // Tạo user từ DTO và mã hóa mật khẩu
        Users users = userMapper.toManager(managerRequest);
        roles.add(Roles.MANAGER.name());
        users.setRoles(roles);
        users.setCreateAt(LocalDate.now());
        users.setPassword(passwordEncoder.encode(managerRequest.getPassword()));
        return userRepository.save(users);
    }

    // Cập nhật User
    @Transactional
    public Users updateUser(Authentication authentication, UserRequest userDTO) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        if (!existingUser.getUsername().equals(userDTO.getUsername()) &&
                userRepository.existsByUsername(userDTO.getUsername())) {
            throw new AppException(ErrorCodeUser.USER_EXISTED);
        }

        if (!existingUser.getEmail().equals(userDTO.getEmail()) &&
                userRepository.existsByEmail(userDTO.getEmail())) {
            throw new AppException(ErrorCodeUser.EMAIL_EXISTED);
        }

        if (!existingUser.getPhone().equals(userDTO.getPhone()) &&
                userRepository.existsByPhone(userDTO.getPhone())) {
            throw new AppException(ErrorCodeUser.PHONE_EXISTED);
        }
        if (!existingUser.getPassword().equals(userDTO.getPassword()) &&
                userRepository.existsByPassword(userDTO.getPassword())) {
            throw new AppException(ErrorCodeUser.PHONE_EXISTED);
        }


        Users updatedUser = userMapper.toUser(userDTO);
        updatedUser.setUserId(existingUser.getUserId());
        updatedUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        return userRepository.save(updatedUser);
    }

    public void updatePasswordByEmail(String email, String newPassword) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);

        userRepository.save(user);
    }

    private void validateUser(UserRequest userDTO) {
        Map<String, String> errors = new HashMap<>();

        if (userRepository.existsByUsername(userDTO.getUsername())) {
            errors.put("username", "USER_EXISTED");
        }

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            errors.put("email", "EMAIL_EXISTED");
        }

        if (userRepository.existsByPhone(userDTO.getPhone())) {
            errors.put("phone", "PHONE_EXISTED");
        }

        if (!userDTO.getPassword().equals(userDTO.getConfirmPassword())) {
            errors.put("confirmPassword", "CONFIRM_PASSWORD_NOT_MATCHING");
        }

        if (!errors.isEmpty()) {
            throw new MultiFieldValidationException(errors);
        }
    }

    private void validateStaff(StaffRequest staffRequest) {
        Map<String, String> errors = new HashMap<>();

        if (userRepository.existsByUsername(staffRequest.getUsername())) {
            errors.put("username", "USER_EXISTED");
        }

        if (userRepository.existsByEmail(staffRequest.getEmail())) {
            errors.put("email", "EMAIL_EXISTED");
        }

        if (userRepository.existsByPhone(staffRequest.getPhone())) {
            errors.put("phone", "PHONE_EXISTED");
        }

        if (!staffRequest.getPassword().equals(staffRequest.getConfirmPassword())) {
            errors.put("confirmPassword", "CONFIRM_PASSWORD_NOT_MATCHING");
        }

        if (!errors.isEmpty()) {
            throw new MultiFieldValidationException(errors);
        }
    }

    private void validateManager(ManagerRequest managerRequest) {
        Map<String, String> errors = new HashMap<>();

        if (userRepository.existsByUsername(managerRequest.getUsername())) {
            errors.put("username", "USER_EXISTED");
        }

        if (userRepository.existsByEmail(managerRequest.getEmail())) {
            errors.put("email", "EMAIL_EXISTED");
        }

        if (userRepository.existsByPhone(managerRequest.getPhone())) {
            errors.put("phone", "PHONE_EXISTED");
        }

        if (!managerRequest.getPassword().equals(managerRequest.getConfirmPassword())) {
            errors.put("confirmPassword", "CONFIRM_PASSWORD_NOT_MATCHING");
        }

        if (!errors.isEmpty()) {
            throw new MultiFieldValidationException(errors);
        }
    }


}
