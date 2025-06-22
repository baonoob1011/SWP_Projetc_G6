package swp.project.adn_backend.controller.result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.result.ResultLocusRequest;
import swp.project.adn_backend.dto.response.result.ResultDetailResponse;
import swp.project.adn_backend.dto.response.result.ResultLocusResponse;
import swp.project.adn_backend.service.result.ResultLocusService;

import java.util.List;

@RestController
@RequestMapping("/api/result-locus")
public class ResultLocusController {
    @Autowired
    private ResultLocusService resultLocusService;
    @PostMapping("/create-result-locus")
    public ResponseEntity<ResultDetailResponse> createResultLocusAndDetail(
            @RequestParam long sampleId1,
            @RequestParam long sampleId2,
            @RequestParam long appointmentId,
            @RequestBody ResultLocusRequest resultLocusRequest
    ) {
        ResultDetailResponse response = resultLocusService.createResultLocusAndDetail(sampleId1, sampleId2, appointmentId, resultLocusRequest);
        return ResponseEntity.ok(response);
    }


}
