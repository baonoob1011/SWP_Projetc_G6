package swp.project.adn_backend.controller.payment;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.payment.CreatePaymentRequest;
import swp.project.adn_backend.entity.Invoice;
import swp.project.adn_backend.service.payment.CreatePaymentService;
import swp.project.adn_backend.service.payment.InvoiceService;
import swp.project.adn_backend.service.payment.VNPayService;
import swp.project.adn_backend.dto.InfoDTO.PaymentInfoDTO;
import swp.project.adn_backend.service.payment.PaymentService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private PaymentService paymentService;
    private VNPayService vnPayService;
    private PaymentService getPaymentService;
    private CreatePaymentService createPaymentService;
    private InvoiceService invoiceService;

//    @PostMapping("/create-payment")
//    public ResponseEntity<Payment> createPayment(PaymentRequest paymentRequest) {
//        return ResponseEntity.ok(paymentService.createPayment(paymentRequest));
//    }


    @Autowired
    public PaymentController(PaymentService paymentService, VNPayService vnPayService, PaymentService getPaymentService, CreatePaymentService createPaymentService, InvoiceService invoiceService) {
        this.paymentService = paymentService;
        this.vnPayService = vnPayService;
        this.getPaymentService = getPaymentService;
        this.createPaymentService = createPaymentService;
        this.invoiceService = invoiceService;
    }

    @GetMapping("/get-all-payment")
    public ResponseEntity<List<PaymentInfoDTO>> getAllPayment(Authentication authentication) {
        return ResponseEntity.ok(paymentService.getAllPayment(authentication));
    }

    // ✅ Tạo đơn hàng và trả về URL VNPay để chuyển hướng người dùng đến thanh toán
    @PostMapping("/create")
    public ResponseEntity<String> createPayment(
            @RequestParam long paymentId,
            @RequestParam long serviceId
    ) {
        CreatePaymentRequest createPaymentRequest = createPaymentService.createPayment(paymentId, serviceId);
        String paymentUrl = vnPayService.createOrder((int) createPaymentRequest.getAmount(),
                createPaymentRequest.getOrderInfo(),
                createPaymentRequest.getReturnUrlBase());
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/api/v1/payment/vnpay-return")
    public ResponseEntity<Invoice> handleVNPayReturn(@RequestParam Map<String, String> params) {
        String vnpTxnRef = params.get("vnp_TxnRef");
        String vnpResponseCode = params.get("vnp_ResponseCode");
        String vnpTransactionStatus = params.get("vnp_TransactionStatus");
        String vnpSecureHash = params.get("vnp_SecureHash");

        boolean isValid = vnPayService.validateVNPaySignature(params, vnpSecureHash);
        if (!isValid || !"00".equals(vnpResponseCode) || !"00".equals(vnpTransactionStatus)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // trả về 400 mà không có body
        }

        return invoiceService.getInvoiceByTxnRef(vnpTxnRef)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }


    // ✅ Xử lý khi VNPay redirect về URL của bạn
    @GetMapping("/vnpay-payment")
    public ResponseEntity<String> paymentReturn(HttpServletRequest request) {
        int result = vnPayService.orderReturn(request);
        if (result == 1) {
            return ResponseEntity.ok("Thanh toán thành công");
        } else if (result == 0) {
            return ResponseEntity.badRequest().body("Thanh toán thất bại");
        } else {
            return ResponseEntity.status(403).body("Sai checksum hoặc dữ liệu");
        }
    }

    // ✅ Lấy lịch sử thanh toán của người dùng đã đăng nhập
    @GetMapping("/history")
    public ResponseEntity<List<PaymentInfoDTO>> getPaymentHistory(Authentication authentication) {
        List<PaymentInfoDTO> list = getPaymentService.getAllPayment(authentication);
        return ResponseEntity.ok(list);
    }
//    @GetMapping("/return-order-payment")
//    public
}
