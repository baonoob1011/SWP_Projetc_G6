package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.KitDeliveryStatus;

import java.util.Optional;


@RepositoryRestResource(path = "kit_delivery-status")
public interface KitDeliveryStatusRepository extends JpaRepository<KitDeliveryStatus,Long> {

}