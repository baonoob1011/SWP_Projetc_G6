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
import swp.project.adn_backend.dto.request.ManagerRequest;
import swp.project.adn_backend.dto.request.StaffRequest;
import swp.project.adn_backend.entity.Manager;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.ManagerMapper;
import swp.project.adn_backend.mapper.StaffMapper;
import swp.project.adn_backend.repository.ManagerRepository;
import swp.project.adn_backend.repository.StaffRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.time.LocalDate;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = false)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ManagerService {

    UserRepository userRepository;
    ManagerRepository managerRepository;
    ManagerMapper managerMapper;

    @Autowired
    public ManagerService(UserRepository userRepository, ManagerRepository managerRepository, ManagerMapper managerMapper) {
        this.userRepository = userRepository;
        this.managerRepository = managerRepository;
        this.managerMapper = managerMapper;
    }

    public Manager createManager(ManagerRequest managerRequest, Authentication authentication){
        if (managerRepository.existsByUsername(managerRequest.getUsername())) {
            throw new AppException(ErrorCodeUser.USER_EXISTED);
        }

        if (managerRepository.existsByEmail(managerRequest.getEmail())) {
            throw new AppException(ErrorCodeUser.EMAIL_EXISTED);
        }

        if (managerRepository.existsByPhone(managerRequest.getPhone())) {
            throw new AppException(ErrorCodeUser.PHONE_EXISTED);
        }
        if (!managerRequest.getPassword().equals(managerRequest.getConfirmPassword())) {
            throw new AppException(ErrorCodeUser.CONFIRM_PASSWORD_NOT_MATCHING);
        }
        Manager manager =managerMapper.toManager(managerRequest);
        manager.setRole(Roles.MANAGER.name());
        manager.setCreateAt(LocalDate.now());

        //người tạo ra staff
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users users = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        manager.setUsers(users);

        return managerRepository.save(manager);
    }
    private void validateManager(ManagerRequest managerRequest) {
        if (userRepository.existsByUsername(managerRequest.getUsername())) {
            throw new AppException(ErrorCodeUser.USER_EXISTED);
        }

        if (userRepository.existsByEmail(managerRequest.getEmail())) {
            throw new AppException(ErrorCodeUser.EMAIL_EXISTED);
        }

        if (userRepository.existsByPhone(managerRequest.getPhone())) {
            throw new AppException(ErrorCodeUser.PHONE_EXISTED);
        }

        if (!managerRequest.getPassword().equals(managerRequest.getConfirmPassword())) {
            throw new AppException(ErrorCodeUser.CONFIRM_PASSWORD_NOT_MATCHING);
        }

    }
}
