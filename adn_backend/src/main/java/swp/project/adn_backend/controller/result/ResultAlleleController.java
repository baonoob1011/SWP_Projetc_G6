package swp.project.adn_backend.controller.result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.result.ResultAlleleRequest;
import swp.project.adn_backend.dto.request.result.ResultLocusRequest;
import swp.project.adn_backend.dto.response.result.ResultAlleleResponse;
import swp.project.adn_backend.dto.response.result.ResultLocusResponse;
import swp.project.adn_backend.service.result.ResultAlleleService;
import swp.project.adn_backend.service.result.ResultLocusService;

import java.util.List;

@RestController
@RequestMapping("/api/result-allele")
public class ResultAlleleController {
    @Autowired
    private ResultAlleleService resultAlleleService;

    @PostMapping("/create-result-allele")
    public ResponseEntity<ResultAlleleResponse> createResultLocus(
            @RequestBody ResultAlleleRequest resultAlleleRequest,
            @RequestParam long sampleId) {
        return ResponseEntity.ok(resultAlleleService.createAllele(resultAlleleRequest,sampleId));
    }

}
