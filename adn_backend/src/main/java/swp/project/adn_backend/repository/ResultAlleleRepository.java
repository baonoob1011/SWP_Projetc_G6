package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.ResultAllele;
import swp.project.adn_backend.enums.AlleleStatus;

import java.util.List;
import java.util.Optional;


@RepositoryRestResource(path = "result_allele")
public interface ResultAlleleRepository extends JpaRepository<ResultAllele,Long> {
    List<ResultAllele> findBySample_SampleId(Long sampleId);
    int countBySample_SampleIdAndAlleleStatus(Long sampleId, AlleleStatus status);


}