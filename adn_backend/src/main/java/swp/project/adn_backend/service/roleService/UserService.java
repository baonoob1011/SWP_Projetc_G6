package swp.project.adn_backend.service.roleService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.transaction.annotation.Transactional;
import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.StaffBasicInfo;
import swp.project.adn_backend.dto.InfoDTO.UserResponse;
import swp.project.adn_backend.dto.request.account.StaffAccountRequest;
import swp.project.adn_backend.dto.request.roleRequest.ManagerRequest;
import swp.project.adn_backend.dto.request.roleRequest.StaffRequest;
import swp.project.adn_backend.dto.request.roleRequest.UserRequest;
import swp.project.adn_backend.dto.request.updateRequest.UpdateUserRequest;
import swp.project.adn_backend.dto.response.role.UpdateUserResponse;
import swp.project.adn_backend.entity.Manager;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.entity.Wallet;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.enums.StaffStatus;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.exception.MultiFieldValidationException;
import swp.project.adn_backend.mapper.ManagerMapper;
import swp.project.adn_backend.mapper.StaffMapper;
import swp.project.adn_backend.mapper.UserMapper;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.service.authService.SendEmailService;
import org.springframework.mail.SimpleMailMessage;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;


@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserService {
    WalletRepository walletRepository;
    WalletTransactionRepository walletTransactionRepository;
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
    public UserService(WalletRepository walletRepository, WalletTransactionRepository walletTransactionRepository, UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, EntityManager entityManager, StaffRepository staffRepository, ManagerRepository managerRepository, StaffMapper staffMapper, ManagerMapper managerMapper, SendEmailService sendEmailService) {
        this.walletRepository = walletRepository;
        this.walletTransactionRepository = walletTransactionRepository;
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

    public UserResponse getUserInfo(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.UserResponse(" +
                "s.userId, s.fullName, s.phone, s.address, s.email, s.avatarUrl) FROM Users s " +
                "Where s.userId=:userId";
        TypedQuery<UserResponse> query = entityManager.createQuery(jpql, UserResponse.class);
        query.setParameter("userId", userId);
        return query.getSingleResult();
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
        String seed = URLEncoder.encode(users.getFullName(), StandardCharsets.UTF_8);
        String avatarUrl = "https://api.dicebear.com/9.x/personas/svg?seed=" + seed;
        users.setAvatarUrl(avatarUrl);
        users.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        // Lưu lại để cascade lưu role
        userRepository.save(users);
        Wallet wallet = new Wallet();
        wallet.setUser(users);
        wallet.setBalance(0);
        wallet.setCreatedAt(LocalDate.now());
        wallet.setUpdatedAt(LocalDate.now());
        walletRepository.save(wallet);
        return users;
    }

    public Users registerAccount(StaffAccountRequest staffAccountRequest,
                                 Authentication authentication) {
        // Generate random username and password
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userRegister = userRepository.findById(userId)

                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        String username = "staff_" + generateRandomString(5);
        String password = generateRandomPassword(5);

        // Create user and set random credentials
        Users users = userMapper.toAccount(staffAccountRequest);
        users.setUsername(username);
        users.setPassword(passwordEncoder.encode(password));

        // Set roles and create date
        HashSet<String> roles = new HashSet<>();
        roles.add(Roles.STAFF.name());
        users.setRoles(roles);
        users.setCreateAt(LocalDate.now());
        sendWelcomeEmail(users.getEmail(), users.getUsername(), password);
        String seed = URLEncoder.encode(users.getFullName(), StandardCharsets.UTF_8);
        String avatarUrl = "https://api.dicebear.com/9.x/personas/svg?seed=" + seed;
        users.setAvatarUrl(avatarUrl);
        // Save user and return
        userRepository.save(users);
        Staff staff = staffMapper.toStaffAccount(staffAccountRequest);
        staff.setRole("STAFF");
        staff.setAvatarUrl(avatarUrl);
        staff.setStaffId(users.getUserId());
        staff.setCreateAt(LocalDate.now());
        staff.setUsers(userRegister);
        staffRepository.save(staff);
        return users;

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
        String seed = URLEncoder.encode(users.getFullName(), StandardCharsets.UTF_8);
        String avatarUrl = "https://api.dicebear.com/9.x/personas/svg?seed=" + seed;
        users.setAvatarUrl(avatarUrl);
        userRepository.save(users);
        //add vao bang staff

        Staff staff = staffMapper.toStaff(staffRequest);
        staff.setRole("STAFF");
        staff.setAvatarUrl(avatarUrl);
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

    public Users registerLabTechnicianAccount(StaffRequest staffRequest, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));


        HashSet<String> roles = new HashSet<>();
        validateStaff(staffRequest);
        // Tạo user từ DTO và mã hóa mật khẩu
        Users users = userMapper.toStaff(staffRequest);
        roles.add(Roles.LAB_TECHNICIAN.name());
        users.setRoles(roles);
        users.setCreateAt(LocalDate.now());
        users.setPassword(passwordEncoder.encode(staffRequest.getPassword()));
        String seed = URLEncoder.encode(users.getFullName(), StandardCharsets.UTF_8);
        String avatarUrl = "https://api.dicebear.com/9.x/personas/svg?seed=" + seed;
        users.setAvatarUrl(avatarUrl);
        userRepository.save(users);
        //add vao bang staff

        Staff staff = staffMapper.toStaff(staffRequest);
        staff.setRole("LAB_TECHNICIAN");
        staff.setStaffId(users.getUserId());
        staff.setCreateAt(LocalDate.now());
        staff.setAvatarUrl(avatarUrl);
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

    public Users registerConsultantAccount(StaffRequest staffRequest, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));


        HashSet<String> roles = new HashSet<>();
        validateStaff(staffRequest);
        // Tạo user từ DTO và mã hóa mật khẩu
        Users users = userMapper.toStaff(staffRequest);
        roles.add(Roles.CONSULTANT.name());
        users.setRoles(roles);
        users.setCreateAt(LocalDate.now());
        users.setPassword(passwordEncoder.encode(staffRequest.getPassword()));
        String seed = URLEncoder.encode(users.getFullName(), StandardCharsets.UTF_8);
        String avatarUrl = "https://api.dicebear.com/9.x/personas/svg?seed=" + seed;
        users.setAvatarUrl(avatarUrl);
        userRepository.save(users);
        //add vao bang staff

        Staff staff = staffMapper.toStaff(staffRequest);
        staff.setRole("CONSULTANT");
        staff.setAvatarUrl(avatarUrl);
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

    public Users registerStaffCollectorSampleAccount(StaffRequest staffRequest, Authentication authentication) {
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
        String seed = URLEncoder.encode(users.getFullName(), StandardCharsets.UTF_8);
        String avatarUrl = "https://api.dicebear.com/9.x/personas/svg?seed=" + seed;
        users.setAvatarUrl(avatarUrl);
        userRepository.save(users);
        //add vao bang staff

        Staff staff = staffMapper.toStaff(staffRequest);
        staff.setRole("SAMPLE_COLLECTOR");
        staff.setStaffId(users.getUserId());
        staff.setCreateAt(LocalDate.now());
        staff.setAvatarUrl(avatarUrl);

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

    public Users registerStaffCollectorSampleAtHomeAccount(StaffRequest staffRequest, Authentication authentication) {
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
        String seed = URLEncoder.encode(users.getFullName(), StandardCharsets.UTF_8);
        String avatarUrl = "https://api.dicebear.com/9.x/personas/svg?seed=" + seed;
        users.setAvatarUrl(avatarUrl);
        userRepository.save(users);
        //add vao bang staff

        Staff staff = staffMapper.toStaff(staffRequest);
        staff.setRole("SAMPLE_COLLECTOR_AT_HOME");
        staff.setStaffId(users.getUserId());
        staff.setCreateAt(LocalDate.now());
        staff.setAvatarUrl(avatarUrl);

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

    public Users registerCashierAccount(StaffRequest staffRequest, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userRegister = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));


        HashSet<String> roles = new HashSet<>();
        validateStaff(staffRequest);
        // Tạo user từ DTO và mã hóa mật khẩu
        Users users = userMapper.toStaff(staffRequest);
        roles.add(Roles.CASHIER.name());
        users.setRoles(roles);
        users.setCreateAt(LocalDate.now());
        users.setPassword(passwordEncoder.encode(staffRequest.getPassword()));
        String seed = URLEncoder.encode(users.getFullName(), StandardCharsets.UTF_8);
        String avatarUrl = "https://api.dicebear.com/9.x/personas/svg?seed=" + seed;
        users.setAvatarUrl(avatarUrl);
        userRepository.save(users);
        //add vao bang staff

        Staff staff = staffMapper.toStaff(staffRequest);
        staff.setRole("CASHIER");
        staff.setStaffId(users.getUserId());
        staff.setAvatarUrl(avatarUrl);

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

    public Users registerStaffAtHomeAccount(StaffRequest staffRequest, Authentication authentication) {
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
        String seed = URLEncoder.encode(users.getFullName(), StandardCharsets.UTF_8);
        String avatarUrl = "https://api.dicebear.com/9.x/personas/svg?seed=" + seed;
        users.setAvatarUrl(avatarUrl);
        userRepository.save(users);
        //add vao bang staff

        Staff staff = staffMapper.toStaff(staffRequest);
        staff.setRole("STAFF_AT_HOME");
        staff.setStaffId(users.getUserId());
        staff.setAvatarUrl(avatarUrl);

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
        String seed = URLEncoder.encode(users.getFullName(), StandardCharsets.UTF_8);
        String avatarUrl = "https://api.dicebear.com/9.x/personas/svg?seed=" + seed;
        users.setAvatarUrl(avatarUrl);
        userRepository.save(users);
        //add vao bang staff
        Manager manager = managerMapper.toManager(managerRequest);
        manager.setRole("MANAGER");
        manager.setManagerId(users.getUserId());
        manager.setCreateAt(LocalDate.now());
        manager.setAvatarUrl(avatarUrl);

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
    public UpdateUserResponse updateUser(Authentication authentication, UpdateUserRequest updateUserRequest) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));


        // 🔐 Email check
        if (updateUserRequest.getEmail() != null &&
                !updateUserRequest.getEmail().equals(existingUser.getEmail()) &&
                userRepository.existsByEmail(updateUserRequest.getEmail())) {
            throw new AppException(ErrorCodeUser.EMAIL_EXISTED);
        }

        // 🔐 Phone check
        if (updateUserRequest.getPhone() != null &&
                !updateUserRequest.getPhone().equals(existingUser.getPhone()) &&
                userRepository.existsByPhone(updateUserRequest.getPhone())) {
            throw new AppException(ErrorCodeUser.PHONE_EXISTED);
        }

        // 🔐 Old password check (if user wants to change password)
        if (updateUserRequest.getOldPassword() != null) {
            if (!passwordEncoder.matches(updateUserRequest.getOldPassword(), existingUser.getPassword())) {
                throw new AppException(ErrorCodeUser.OLD_PASSWORD_NOT_MAPPING);
            }
        }
        if (updateUserRequest.getPassword() != null && updateUserRequest.getConfirmPassword() != null) {
            if (!updateUserRequest.getPassword().equals(updateUserRequest.getConfirmPassword())) {
                throw new AppException(ErrorCodeUser.CONFIRM_PASSWORD_NOT_MATCH);
            }

            if (passwordEncoder.matches(updateUserRequest.getPassword(), existingUser.getPassword())) {
                throw new AppException(ErrorCodeUser.PASSWORD_EXISTED);
            }

            existingUser.setPassword(passwordEncoder.encode(updateUserRequest.getPassword()));
        }
        // ✅ Set new values
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

        // ✅ Save and map to response
        userRepository.save(existingUser);
        return userMapper.toUpdateUserResponse(existingUser);
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

    private void sendWelcomeEmail(String email, String username, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Welcome to ADN Medical Center - Staff Account Created");
        message.setText(
                "Welcome to ADN Medical Center! Your staff account has been successfully created.\n\n" +
                        "Your account details:\n" +
                        "Username: " + username + "\n" +
                        "Password: " + password + "\n\n" +
                        "Email: " + email + "\n" +
                        "You can now log in to the system using your credentials.\n\n" +
                        "Best regards,\n" +
                        "ADN Medical Center Team");

        try {
            sendEmailService.sendEmailCreateAccountSuccessful(email, message.getText());
        } catch (Exception e) {
            // Log error or handle email failure
            throw new RuntimeException("Email send fail");
        }
    }

    // Random string generator
    private String generateRandomString(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) sb.append((char) ('a' + random.nextInt(26)));
        return sb.toString();
    }

    // Random password generator
    private String generateRandomPassword(int length) {
        SecureRandom random = new SecureRandom();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) sb.append(chars.charAt(random.nextInt(chars.length())));
        return sb.toString();
    }


}