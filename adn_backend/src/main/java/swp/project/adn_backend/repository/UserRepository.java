package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Users;

import java.util.Optional;

@RepositoryRestResource(path = "users")
public interface UserRepository extends JpaRepository<Users,Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByPassword(String password);
    boolean existsByAddress(String address);
    Optional<Users> findByUsername(String username);
    Optional<Users> findByPhone(String phone);
    Optional<Users> findByEmail(String request);
    Optional<Users> findById(Long id);

    boolean existsByIdCard(String idCard);


}
