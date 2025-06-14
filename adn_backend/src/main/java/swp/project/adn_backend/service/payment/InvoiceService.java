package swp.project.adn_backend.service.payment;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.entity.Invoice;
import swp.project.adn_backend.repository.InvoiceRepository;

import java.util.Optional;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    public Invoice saveInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    // ✅ Thêm hàm để lấy hóa đơn theo txnRef
    public Optional<Invoice> getInvoiceByTxnRef(String txnRef) {
        return invoiceRepository.findByTxnRef(txnRef);
    }
}

