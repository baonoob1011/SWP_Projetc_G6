package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Result;

@RepositoryRestResource(path = "result")
public interface ResultRepository extends JpaRepository<Result,Long> {
}