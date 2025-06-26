package swp.project.adn_backend.service.result;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.AppointmentInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.LocusInfoDTO;
import swp.project.adn_backend.dto.request.result.LocusRequest;
import swp.project.adn_backend.dto.response.result.LocusResponse;
import swp.project.adn_backend.entity.Locus;
import swp.project.adn_backend.enums.AppointmentStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.LocusMapper;
import swp.project.adn_backend.repository.LocusRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class LocusService {
    private LocusRepository locusRepository;
    private LocusMapper locusMapper;
    private EntityManager entityManager;

    @Autowired
    public LocusService(LocusRepository locusRepository, LocusMapper locusMapper, EntityManager entityManager) {
        this.locusRepository = locusRepository;
        this.locusMapper = locusMapper;
        this.entityManager = entityManager;
    }

    public LocusResponse createLocus(LocusRequest locusRequest) {
        Locus locus = locusMapper.toLocus(locusRequest);
        locusRepository.save(locus);
        LocusResponse locusResponse = locusMapper.toLocusResponse(locus);
        return locusResponse;
    }
    public List<LocusInfoDTO> getAllLocus(){
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.LocusInfoDTO(" +
                "s.locusId, s.locusName, s.description) " +
                "FROM Locus s ";
        TypedQuery<LocusInfoDTO> query = entityManager.createQuery(jpql, LocusInfoDTO.class);
        return query.getResultList();

    }
}
