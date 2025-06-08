package swp.project.adn_backend.service.roleService;

import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO;
import swp.project.adn_backend.entity.Manager;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.repository.ManagerRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.util.List;


@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
public class AdminService {

    EntityManager entityManager;
    UserRepository userRepository;
    ManagerRepository managerRepository;

    @Autowired
    public AdminService(EntityManager entityManager, UserRepository userRepository, ManagerRepository managerRepository) {
        this.entityManager = entityManager;
        this.userRepository = userRepository;
        this.managerRepository = managerRepository;
    }

    @Transactional(readOnly = true)
    public List<StaffInfoDTO> getAllManager() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.StaffInfoDTO(" +
                "u.fullName, u.phone, u.email, u.enabled, u.createAt, " +
                "u.idCard, u.gender, u.address, u.dateOfBirth) " +
                "FROM Users u JOIN u.roles r WHERE r = :input";
        TypedQuery<StaffInfoDTO> query = entityManager.createQuery(jpql, StaffInfoDTO.class);
        query.setParameter("input", "MANAGER");

        List<StaffInfoDTO> staffList = query.getResultList();

        for (StaffInfoDTO dto : staffList) {
            dto.setRole("MANAGER"); // thủ công set lại role
        }

        return staffList;
    }


    @Transactional
    public void deleteManagerByPhone(String phone) {
        Users users = userRepository.findByPhone(phone)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PHONE_NOT_EXISTS));
        Manager manager = managerRepository.findByPhone(phone)
                .orElseThrow(() -> new AppException(ErrorCodeUser.PHONE_NOT_EXISTS));
        userRepository.delete(users);
        managerRepository.delete(manager);
    }


}
