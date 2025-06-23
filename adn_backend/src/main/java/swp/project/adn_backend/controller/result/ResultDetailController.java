package swp.project.adn_backend.controller.result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.dto.response.result.ResultDetailResponse;
import swp.project.adn_backend.entity.ResultDetail;
import swp.project.adn_backend.service.result.ResultDetailsService;

@RestController
@RequestMapping("/api/result-detail")
public class ResultDetailController {
    @Autowired
    private ResultDetailsService resultDetailsService;

    @PostMapping("/create-result-detail")
    public ResponseEntity<ResultDetailResponse>createResultDetail(@RequestParam long appointmentId){
        return ResponseEntity.ok(resultDetailsService.CreateResultDetail(appointmentId));
    }
}
