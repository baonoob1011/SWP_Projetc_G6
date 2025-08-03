package swp.project.adn_backend.controller.result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.LocusInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.ResultInfoDTO;
import swp.project.adn_backend.dto.request.HardCopyDeliveryRequest;
import swp.project.adn_backend.dto.request.result.LocusRequest;
import swp.project.adn_backend.dto.response.result.LocusResponse;
import swp.project.adn_backend.service.result.LocusService;
import swp.project.adn_backend.service.result.ResultService;

import java.util.List;

@RestController
@RequestMapping("/api/result")
public class ResultController {
    @Autowired
    private ResultService resultService;

    //user yeu cau gui bang cung
    @PostMapping("/request-send-hard-copy-result")
    public ResponseEntity<String> requestHardCopyDelivery(@RequestParam long appointmentId) {
        resultService.requestHardCopyDelivery(appointmentId);
        return ResponseEntity.ok("yêu cầu gửi bản cứng thành công");
    }
    //staff update trang thai gui bang cung
    @PutMapping("/update-hard-copy-result")
    public ResponseEntity<String> updateHardCopyDelivery(@RequestParam long appointmentId,
                                                         @RequestBody HardCopyDeliveryRequest hardCopyDeliveryRequest) {
        resultService.updateHardCopyDelivery(appointmentId,hardCopyDeliveryRequest);
        return ResponseEntity.ok("update thành công");
    }
    @GetMapping("/get-hard-copy-result")
    public ResponseEntity<List<ResultInfoDTO>> getHardCopyResultStatus() {
        return ResponseEntity.ok(resultService.getHardCopyResultStatus());
    }
}
