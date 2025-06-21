package swp.project.adn_backend.service.result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.result.LocusRequest;
import swp.project.adn_backend.dto.response.result.LocusResponse;
import swp.project.adn_backend.entity.Locus;
import swp.project.adn_backend.mapper.LocusMapper;
import swp.project.adn_backend.repository.LocusRepository;

@Service
public class LocusService {
    private LocusRepository locusRepository;
    private LocusMapper locusMapper;

    @Autowired
    public LocusService(LocusRepository locusRepository, LocusMapper locusMapper) {
        this.locusRepository = locusRepository;
        this.locusMapper = locusMapper;
    }

    public LocusResponse createLocus(LocusRequest locusRequest) {
        Locus locus = locusMapper.toLocus(locusRequest);
        locusRepository.save(locus);
        LocusResponse locusResponse = locusMapper.toLocusResponse(locus);
        return locusResponse;

    }
}
