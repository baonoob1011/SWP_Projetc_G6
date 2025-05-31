package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.dto.request.OtpRequest;
import swp.project.adn_backend.entity.Users;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(path = "users")
public interface UserRepository extends JpaRepository<Users,Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    Optional<Users> findByUsername(String username);
    Optional<Users> findByEmail(String request);
    Optional<Users> findById(Long id);
}
