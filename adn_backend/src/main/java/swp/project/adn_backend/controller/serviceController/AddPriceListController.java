package swp.project.adn_backend.controller.serviceController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.PriceInfoDTO;
import swp.project.adn_backend.dto.request.serviceRequest.AddPriceListRequest;
import swp.project.adn_backend.service.registerServiceTestService.AddPriceListService;

import java.util.List;

@RestController
@RequestMapping("/api/price")
public class AddPriceListController {
    @Autowired
    private AddPriceListService addPriceListService;

    @PostMapping("/add-more-price/{serviceId}")
    public ResponseEntity<String> addPrice(@RequestBody AddPriceListRequest addPriceListRequest,
                                           @PathVariable("serviceId") long serviceId) {
        addPriceListService.addMorePriceList(addPriceListRequest, serviceId);
        return ResponseEntity.ok("add price successful");
    }

    @GetMapping("/get-all-price/{serviceId}")
    public ResponseEntity<List<PriceInfoDTO>> getAllPrice(@PathVariable("serviceId") long serviceId) {
        return ResponseEntity.ok(addPriceListService.getAllPrice(serviceId));
    }
}
