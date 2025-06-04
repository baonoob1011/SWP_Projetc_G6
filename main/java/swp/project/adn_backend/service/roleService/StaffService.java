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
import swp.project.adn_backend.dto.request.StaffRequest;
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
import java.util.Map;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StaffService {

    UserRepository userRepository;
    StaffRepository staffRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;


    @Autowired
    public StaffService(UserRepository userRepository, StaffRepository staffRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }


    // update staff
    @Transactional
    public Users updateStaff(StaffRequest staffRequest, Authentication authentication) {
        validateUpdateStaff(staffRequest, authentication);
        Users staff = userMapper.toStaff(staffRequest);
        return userRepository.save(staff);

    }

    public Users findUserByPhone(String phone) {
        Users users = userRepository.findByPhone(phone)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PHONE_NOT_EXISTS));
        return users;
    }


    private void validateUpdateStaff(StaffRequest staffRequest, Authentication authentication) {
        Map<String, String> errors = new HashMap<>();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long staffId = jwt.getClaim("id");
        Staff existingStaff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));


        if (!existingStaff.getUsername().equals(staffRequest.getUsername()) &&
                staffRepository.existsByUsername(staffRequest.getUsername())) {
            errors.put("username", "USER_EXISTED");
        }

        if (!existingStaff.getEmail().equals(staffRequest.getEmail()) &&
                staffRepository.existsByEmail(staffRequest.getEmail())) {
            errors.put("email", "EMAIL_EXISTED");
        }

        if (!existingStaff.getPhone().equals(staffRequest.getPhone()) &&
                staffRepository.existsByPhone(staffRequest.getPhone())) {
            errors.put("phone", "PHONE_EXISTED");
        }
        if (!existingStaff.getAddress().equals(staffRequest.getAddress()) &&
                staffRepository.existsByAddress(staffRequest.getAddress())) {
            errors.put("address", "ADDRESS_EXISTED");
        }
        if (!existingStaff.getIdCard().equals(staffRequest.getIdCard()) &&
                staffRepository.existsByAddress(staffRequest.getIdCard())) {
            errors.put("id card", "ID_CART_EXISTED");
        }
        if (!errors.isEmpty()) {
            throw new MultiFieldValidationException(errors);
        }
    }

}
