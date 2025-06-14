package swp.project.adn_backend.service.payment;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.entity.Invoice;
import swp.project.adn_backend.enums.TransactionStatus;
import swp.project.adn_backend.repository.InvoiceRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    public Invoice saveInvoice(Invoice invoice) {
        invoice.setBankCode(generateRandomBankCode(6));
        invoice.setCreatedDate(LocalDateTime.now());
        invoice.setTransactionStatus(TransactionStatus.SUCCESS);
        return invoiceRepository.save(invoice);
    }

    // ✅ Thêm hàm để lấy hóa đơn theo txnRef
    public Optional<Invoice> getInvoiceByTxnRef(String txnRef) {
        return invoiceRepository.findByTxnRef(txnRef);
    }
    public String generateRandomBankCode(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }
        return code.toString();
    }

}

