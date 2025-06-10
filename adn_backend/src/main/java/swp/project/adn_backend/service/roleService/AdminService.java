package swp.project.adn_backend.service.roleService;

import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.ManagerInfoDTO;
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
    public List<ManagerInfoDTO> getAllManager() {
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.ManagerInfoDTO(" +
                "s.managerId, s.fullName, s.phone, s.email, " +
                "s.idCard, s.gender, s.address, s.dateOfBirth) " +
                "FROM Manager s";

        TypedQuery<ManagerInfoDTO> query = entityManager.createQuery(jpql, ManagerInfoDTO.class);
        return query.getResultList();
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
