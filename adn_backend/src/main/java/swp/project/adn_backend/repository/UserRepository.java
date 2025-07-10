package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    // JPQL queries for dashboard statistics
    @Query("SELECT COUNT(u) FROM Users u WHERE u.enabled = true")
    long countActiveUsers();
    
    @Query("SELECT COUNT(u) FROM Users u WHERE u.enabled = false OR u.enabled IS NULL")
    long countInactiveUsers();
    
    @Query("SELECT COUNT(u) FROM Users u WHERE 'PATIENT' MEMBER OF u.roles")
    long countUsersByPatientRole();
    
//    @Query("SELECT COUNT(u) FROM Users u WHERE 'STAFF' MEMBER OF u.roles")
//    long countUsersByStaffRole();
    
    @Query("SELECT COUNT(u) FROM Users u WHERE 'MANAGER' MEMBER OF u.roles")
    long countUsersByManagerRole();
    
    @Query("SELECT COUNT(u) FROM Users u WHERE 'ADMIN' MEMBER OF u.roles")
    long countUsersByAdminRole();
}
