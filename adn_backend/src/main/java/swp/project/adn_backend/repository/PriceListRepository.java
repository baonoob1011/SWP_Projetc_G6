package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Patient;
import swp.project.adn_backend.entity.PriceList;


@RepositoryRestResource(path = "price-list")
public interface PriceListRepository extends JpaRepository<PriceList,Long> {
}