package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.AdministrativeService;
import swp.project.adn_backend.entity.Invoice;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.entity.WalletTransaction;

import java.util.Optional;

@RepositoryRestResource(path = "wallet-transaction")
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction,Long> {
    Optional<WalletTransaction> findByTxnRef(String txnRef);

}
