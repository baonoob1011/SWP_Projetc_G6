package swp.project.adn_backend.controller.result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.LocusInfoDTO;
import swp.project.adn_backend.dto.request.result.LocusRequest;
import swp.project.adn_backend.dto.request.result.ResultAlleleRequest;
import swp.project.adn_backend.dto.response.result.LocusResponse;
import swp.project.adn_backend.dto.response.result.ResultAlleleResponse;
import swp.project.adn_backend.service.result.LocusService;
import swp.project.adn_backend.service.result.ResultAlleleService;

import java.util.List;

@RestController
@RequestMapping("/api/locus")
public class LocusController {
    @Autowired
    private LocusService locusService;

    @PostMapping("/create-locus")
    public ResponseEntity<LocusResponse> createResultLocus(
            @RequestBody LocusRequest locusRequest) {
        return ResponseEntity.ok(locusService.createLocus(locusRequest));
    }

    @GetMapping("/get-all-locus")
    public ResponseEntity<List<LocusInfoDTO>>getAllLocus(){
        return ResponseEntity.ok(locusService.getAllLocus());
    }
}
