package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.ResultDetail;
import swp.project.adn_backend.entity.ResultLocus;


@RepositoryRestResource(path = "result-locus")
public interface ResultLocusRepository extends JpaRepository<ResultLocus,Long> {
}