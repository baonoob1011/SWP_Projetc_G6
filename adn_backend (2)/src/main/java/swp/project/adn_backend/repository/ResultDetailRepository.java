package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Result;
import swp.project.adn_backend.entity.ResultDetail;


@RepositoryRestResource(path = "result-detail")
public interface ResultDetailRepository extends JpaRepository<ResultDetail,Long> {
}