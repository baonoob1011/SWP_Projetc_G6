package swp.project.adn_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.discount.DiscountRequest;
import swp.project.adn_backend.dto.response.discount.DiscountResponse;
import swp.project.adn_backend.service.discount.DiscountService;

import java.util.List;

@RestController
@RequestMapping("/api/discount")
public class DiscountController {
    @Autowired
    private DiscountService discountService;

    @PostMapping("/create-discount-service")
    public ResponseEntity<DiscountResponse> createDiscount(@RequestParam long serviceId,
                                                           @RequestBody DiscountRequest discountRequest) {
        return ResponseEntity.ok(discountService.createDiscount(serviceId, discountRequest));
    }

    @GetMapping("/get-discount-by-service")
    public ResponseEntity<List<DiscountResponse>> getDiscountByServiceId(@RequestParam long serviceId) {
        return ResponseEntity.ok(discountService.getDiscountByServiceId(serviceId));
    }
}
