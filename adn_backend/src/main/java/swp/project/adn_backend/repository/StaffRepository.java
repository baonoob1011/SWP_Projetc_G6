package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;

import java.util.Optional;


@RepositoryRestResource(path = "staff")
public interface StaffRepository extends JpaRepository<Staff,Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByAddress(String address);
    Optional<Staff> findByPhone(String phone);
    Optional<Staff> findByUsername(String username);


}