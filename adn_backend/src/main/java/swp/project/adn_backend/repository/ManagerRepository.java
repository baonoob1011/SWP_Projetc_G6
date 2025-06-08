package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Manager;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;

import java.util.Optional;


@RepositoryRestResource(path = "manager")
public interface ManagerRepository extends JpaRepository<Manager, Long> {
    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByIdCard(String idCard);

    Optional<Manager> deleteByPhone(String phone);

    Optional<Manager> findByPhone(String phone);

    Optional<Manager> findByEmail(String request);

    Optional<Manager> findById(Long id);
}