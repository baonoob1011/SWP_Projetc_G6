package swp.project.adn_backend.service;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.StaffRequest;
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
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = false)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StaffService {

    UserRepository userRepository;
    StaffRepository staffRepository;
    StaffMapper staffMapper;

    @Autowired
    public StaffService(UserRepository userRepository, StaffRepository staffRepository, StaffMapper staffMapper) {
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.staffMapper = staffMapper;
    }

    public Staff createStaff(StaffRequest staffRequest, Authentication authentication){
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
        Staff staff=staffMapper.toStaff(staffRequest);
        staff.setRole(Roles.STAFF.name());
        staff.setCreateAt(LocalDate.now());

        //người tạo ra staff
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users users = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        staff.setUsers(users);

        return staffRepository.save(staff);
    }
}
