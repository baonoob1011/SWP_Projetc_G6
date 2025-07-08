package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.AdministrativeService;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.entity.Wallet;

import java.util.Optional;

@RepositoryRestResource(path = "wallet")
public interface WalletRepository extends JpaRepository<Wallet,Long> {
    Optional<Wallet> findByUser(Users user);

}
