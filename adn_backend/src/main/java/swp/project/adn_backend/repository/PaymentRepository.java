package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Manager;
import swp.project.adn_backend.entity.Payment;
import swp.project.adn_backend.entity.Users;

import java.util.Optional;


@RepositoryRestResource(path = "payment")
public interface PaymentRepository extends JpaRepository<Payment, Long> {


}