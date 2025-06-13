package swp.project.adn_backend.service.roleService;

import jakarta.persistence.EntityManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.roleRequest.ManagerRequest;
import swp.project.adn_backend.dto.request.roleRequest.StaffRequest;
import swp.project.adn_backend.dto.request.roleRequest.UserRequest;
import swp.project.adn_backend.dto.request.updateRequest.UpdateUserRequest;
import swp.project.adn_backend.entity.Manager;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.exception.MultiFieldValidationException;
import swp.project.adn_backend.mapper.ManagerMapper;
import swp.project.adn_backend.mapper.StaffMapper;
import swp.project.adn_backend.mapper.UserMapper;
import swp.project.adn_backend.repository.ManagerRepository;
import swp.project.adn_backend.repository.StaffRepository;
import swp.project.adn_backend.repository.UserRepository;
import swp.project.adn_backend.service.authService.SendEmailService;
import org.springframework.mail.SimpleMailMessage;

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
    StaffRepository staffRepository;
    ManagerRepository managerRepository;
    StaffMapper staffMapper;
    ManagerMapper managerMapper;
    SendEmailService sendEmailService;

    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, EntityManager entityManager, StaffRepository staffRepository, ManagerRepository managerRepository, StaffMapper staffMapper, ManagerMapper managerMapper, SendEmailService sendEmailService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.entityManager = entityManager;
        this.staffRepository = staffRepository;
        this.managerRepository = managerRepository;
        this.staffMapper = staffMapper;
        this.managerMapper = managerMapper;
        this.sendEmailService = sendEmailService;
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


    public Users registerStaffAccount(StaffRequest staffRequest, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));


        HashSet<String> roles = new HashSet<>();
        validateStaff(staffRequest);
        // Tạo user từ DTO và mã hóa mật khẩu
        Users users = userMapper.toStaff(staffRequest);
        roles.add(Roles.STAFF.name());
        users.setRoles(roles);
        users.setCreateAt(LocalDate.now());
        users.setPassword(passwordEncoder.encode(staffRequest.getPassword()));
        userRepository.save(users);
        //add vao bang staff

        Staff staff = staffMapper.toStaff(staffRequest);
        staff.setRole("STAFF");
        staff.setStaffId(users.getUserId());
        staff.setCreateAt(LocalDate.now());
        staff.setUsers(userRegister);
        staffRepository.save(staff);

        // Send welcome email to staff
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(users.getEmail());
        message.setSubject("Welcome to ADN Medical Center - Staff Account Created");
        message.setText("Dear " + users.getFullName() + ",\n\n" +
                "Welcome to ADN Medical Center! Your staff account has been successfully created.\n\n" +
                "Your account details:\n" +
                "Username: " + users.getUsername() + "\n" +
                "Password: " + staffRequest.getPassword() + "\n\n" +
                "Email: " + users.getEmail() + "\n" +
                "You can now log in to the system using your credentials.\n\n" +
                "Best regards,\n" +
                "ADN Medical Center Team");
        sendEmailService.sendEmailCreateAccountSuccessful(users.getEmail(), message.getText());

        // Lưu lại để cascade lưu role
        return userRepository.save(users);
    }


    public Users registerManagerAccount(ManagerRequest managerRequest, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        HashSet<String> roles = new HashSet<>();
        validateManager(managerRequest);
        // Tạo user từ DTO và mã hóa mật khẩu
        Users users = userMapper.toManager(managerRequest);
        roles.add(Roles.MANAGER.name());
        users.setRoles(roles);
        users.setCreateAt(LocalDate.now());
        users.setPassword(passwordEncoder.encode(managerRequest.getPassword()));
        userRepository.save(users);
        //add vao bang staff
        Manager manager = managerMapper.toManager(managerRequest);
        manager.setRole("MANAGER");
        manager.setManagerId(users.getUserId());
        manager.setCreateAt(LocalDate.now());
        manager.setUsers(userRegister);
        managerRepository.save(manager);

        // Send welcome email to manager
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(users.getEmail());
        message.setSubject("Welcome to ADN Medical Center - Manager Account Created");
        message.setText("Dear " + users.getFullName() + ",\n\n" +
                "Welcome to ADN Medical Center! Your manager account has been successfully created.\n\n" +
                "Your account details:\n" +
                "Username: " + users.getUsername() + "\n" +
                "Password: " + managerRequest.getPassword() + "\n\n" +
                "Email: " + users.getEmail() + "\n" +
                "You can now log in to the system using your credentials.\n\n" +
                "Best regards,\n" +
                "ADN Medical Center Team");
        sendEmailService.sendEmailCreateAccountSuccessful(users.getEmail(), message.getText());

        return userRepository.save(users);
    }

    // Cập nhật User
    @Transactional
    public Users updateUser(Authentication authentication, UpdateUserRequest updateUserRequest) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        if (updateUserRequest.getEmail() != null) {
            if (!updateUserRequest.getEmail().equals(existingUser.getEmail()) &&
                    userRepository.existsByEmail(updateUserRequest.getEmail())) {
                throw new AppException(ErrorCodeUser.EMAIL_EXISTED);
            }
        }
        if (updateUserRequest.getPhone() != null) {
            if (!updateUserRequest.getPhone().equals(existingUser.getPhone()) &&
                    userRepository.existsByPhone(updateUserRequest.getPhone())) {
                throw new AppException(ErrorCodeUser.PHONE_EXISTED);
            }
        }
        if (updateUserRequest.getOldPassword() != null) {
            if (!passwordEncoder.matches(updateUserRequest.getOldPassword(), existingUser.getPassword())) {
                throw new AppException(ErrorCodeUser.OLD_PASSWORD_NOT_MAPPING);
            }
        }

        if (updateUserRequest.getPassword() != null && updateUserRequest.getConfirmPassword() != null) {
            if (!passwordEncoder.matches(updateUserRequest.getPassword(), existingUser.getPassword())
                    && updateUserRequest.getConfirmPassword().equals(updateUserRequest.getPassword())) {
                existingUser.setPassword(passwordEncoder.encode(updateUserRequest.getPassword()));
            } else {
                throw new AppException(ErrorCodeUser.PASSWORD_EXISTED);
            }
        }

        if (updateUserRequest.getAddress() != null) {
            String oldAddress = existingUser.getAddress();
            if ((oldAddress == null || !oldAddress.equals(updateUserRequest.getAddress())) &&
                    userRepository.existsByAddress(updateUserRequest.getAddress())) {
                throw new AppException(ErrorCodeUser.ADDRESS_EXISTED);
            }
        }


        if (updateUserRequest.getPhone() != null) {
            existingUser.setPhone(updateUserRequest.getPhone());
        }
        if (updateUserRequest.getEmail() != null) {
            existingUser.setEmail(updateUserRequest.getEmail());
        }
        if (updateUserRequest.getFullName() != null) {
            existingUser.setFullName(updateUserRequest.getFullName());
        }
        if (updateUserRequest.getAddress() != null) {
            existingUser.setAddress(updateUserRequest.getAddress());
        }
        return userRepository.save(existingUser);
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
        if (userRepository.existsByIdCard(staffRequest.getIdCard())) {
            errors.put("idCard", "ID_CARD_EXISTED");
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
        if (userRepository.existsByIdCard(managerRequest.getIdCard())) {
            errors.put("idCard", "ID_CARD_EXISTED");
        }
        if (!managerRequest.getPassword().equals(managerRequest.getConfirmPassword())) {
            errors.put("confirmPassword", "CONFIRM_PASSWORD_NOT_MATCHING");
        }

        if (!errors.isEmpty()) {
            throw new MultiFieldValidationException(errors);
        }
    }


}