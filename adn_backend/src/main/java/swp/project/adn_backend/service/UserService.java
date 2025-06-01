package swp.project.adn_backend.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;

import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.UserDTO;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.UserMapper;
import swp.project.adn_backend.repository.UserRepository;

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
        validateUser(userDTO);
        // Tạo user từ DTO và mã hóa mật khẩu
        Users users = userMapper.toUser(userDTO);
        users.setRole("USER");
        users.setPassword(passwordEncoder.encode(userDTO.getPassword()));


        // Lưu lại để cascade lưu role
        return userRepository.save(users);


    }

    // Cập nhật User
    @Transactional
    public Users updateUser(Authentication authentication, UserDTO userDTO) {
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
        if (!userDTO.getPassword().equals(userDTO.getConfirmPassword())) {
            throw new AppException(ErrorCodeUser.CONFIRM_PASSWORD_NOT_MATCHING);
        }

        Users updatedUser = userMapper.toUser(userDTO);
        updatedUser.setUserId(existingUser.getUserId());
        updatedUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        return userRepository.save(updatedUser);
    }

    // Xoá User
    @Transactional
    public Users deleteUser(Authentication authentication,UserDTO userDTO) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        existingUser.setEnabled(false);
       return userRepository.save(existingUser);
    }

    private void validateUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new AppException(ErrorCodeUser.USER_EXISTED);
        }

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new AppException(ErrorCodeUser.EMAIL_EXISTED);
        }

        if (userRepository.existsByPhone(userDTO.getPhone())) {
            throw new AppException(ErrorCodeUser.PHONE_EXISTED);
        }

        if (!userDTO.getPassword().equals(userDTO.getConfirmPassword())) {
            throw new AppException(ErrorCodeUser.CONFIRM_PASSWORD_NOT_MATCHING);
        }
    }

}
