package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.CivilService;
import swp.project.adn_backend.entity.Discount;


@RepositoryRestResource(path = "discount")
public interface DiscountRepository extends JpaRepository<Discount,Long> {
}
