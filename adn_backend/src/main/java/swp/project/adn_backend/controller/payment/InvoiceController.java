package swp.project.adn_backend.controller.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.dto.InfoDTO.InvoiceUserDTO;
import swp.project.adn_backend.service.payment.InvoiceService;

import java.util.List;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceController {
    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/get-invoice-of-user")
    public ResponseEntity<List<InvoiceUserDTO>>getInvoice(@RequestParam long appointmentId){
        return ResponseEntity.ok(invoiceService.getInvoiceOfUser(appointmentId));
    }
}
