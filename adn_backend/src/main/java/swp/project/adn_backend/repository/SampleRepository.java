package swp.project.adn_backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.ResultLocus;
import swp.project.adn_backend.entity.Sample;


@RepositoryRestResource(path = "sample")
public interface SampleRepository extends JpaRepository<Sample,Long> {
}