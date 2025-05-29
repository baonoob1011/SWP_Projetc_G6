package swp.project.adn_backend.service;

import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.UserDTO;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCode;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.UserMapper;
import swp.project.adn_backend.repository.UserRepository;

import java.util.HashSet;
import java.util.List;


@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }



    // Đăng ký User
    public Users registerUserAccount(UserDTO userDTO) {

        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        if (userRepository.existsByPhone(userDTO.getPhone())) {
            throw new AppException(ErrorCode.PHONE_EXISTED);
        }
        if (!userDTO.getPassword().equals(userDTO.getConfirmPassword())) {
            throw new AppException(ErrorCode.CONFIRM_PASSWORD_NOT_MATCHING);
        }
        // MÃ hóa passoword

        Users users = userMapper.toUser(userDTO);

        HashSet<String> role=new HashSet<>();
        role.add(Roles.USER.name());
        users.setRoles(role);

        users.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        return userRepository.save(users);

    }
    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }


    public void updatePasswordByEmail(String email, String newPassword) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);

        userRepository.save(user);
    }

}
