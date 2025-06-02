package swp.project.adn_backend.service;

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
import swp.project.adn_backend.dto.request.UserDTO;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.StaffMapper;
import swp.project.adn_backend.repository.StaffRepository;
import swp.project.adn_backend.repository.UserRepository;

import javax.management.relation.Role;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StaffService {

    UserRepository userRepository;
    StaffRepository staffRepository;
    StaffMapper staffMapper;
    PasswordEncoder passwordEncoder;


    @Autowired
    public StaffService(UserRepository userRepository, StaffRepository staffRepository, StaffMapper staffMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.staffMapper = staffMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public Staff createStaff(StaffRequest staffRequest, Authentication authentication) {
        if (staffRepository.existsByUsername(staffRequest.getUsername())) {
            throw new AppException(ErrorCodeUser.USER_EXISTED);
        }

        if (staffRepository.existsByEmail(staffRequest.getEmail())) {
            throw new AppException(ErrorCodeUser.EMAIL_EXISTED);
        }

        if (staffRepository.existsByPhone(staffRequest.getPhone())) {
            throw new AppException(ErrorCodeUser.PHONE_EXISTED);
        }
        if (!staffRequest.getPassword().equals(staffRequest.getConfirmPassword())) {
            throw new AppException(ErrorCodeUser.CONFIRM_PASSWORD_NOT_MATCHING);
        }
        Staff staff = staffMapper.toStaff(staffRequest);
        staff.setRole(Roles.STAFF.name());
        staff.setCreateAt(LocalDate.now());
        staff.setPassword(passwordEncoder.encode(staffRequest.getPassword()));



        //người tạo ra staff
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users users = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        staff.setUsers(users);

        return staffRepository.save(staff);
    }

    public Staff updateStaff(StaffRequest staffRequest, Authentication authentication){
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Staff existingStaff = staffRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        if (!existingStaff.getUsername().equals(staffRequest.getUsername()) &&
                staffRepository.existsByUsername(staffRequest.getUsername())) {
            throw new AppException(ErrorCodeUser.USER_EXISTED);
        }

        if (!existingStaff.getEmail().equals(staffRequest.getEmail()) &&
                staffRepository.existsByEmail(staffRequest.getEmail())) {
            throw new AppException(ErrorCodeUser.EMAIL_EXISTED);
        }

        if (!existingStaff.getPhone().equals(staffRequest.getPhone()) &&
                staffRepository.existsByPhone(staffRequest.getPhone())) {
            throw new AppException(ErrorCodeUser.PHONE_EXISTED);
        }
        if (!existingStaff.getAddress().equals(staffRequest.getAddress()) &&
                staffRepository.existsByAddress(staffRequest.getAddress())) {
            throw new AppException(ErrorCodeUser.ADDRESS_EXISTED);
        }
        Staff staff=staffMapper.toStaff(staffRequest);
        return staffRepository.save(staff);

    }

    public Users findUserByPhone(String phone) {
        Users users = userRepository.findByPhone(phone)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PHONE_NOT_EXISTS));
        return users;
    }

    private void validateUser(StaffRequest staffRequest) {
        if (userRepository.existsByUsername(staffRequest.getUsername())) {
            throw new AppException(ErrorCodeUser.USER_EXISTED);
        }

        if (userRepository.existsByEmail(staffRequest.getEmail())) {
            throw new AppException(ErrorCodeUser.EMAIL_EXISTED);
        }

        if (userRepository.existsByPhone(staffRequest.getPhone())) {
            throw new AppException(ErrorCodeUser.PHONE_EXISTED);
        }

        if (!staffRequest.getPassword().equals(staffRequest.getConfirmPassword())) {
            throw new AppException(ErrorCodeUser.CONFIRM_PASSWORD_NOT_MATCHING);
        }

    }
}
