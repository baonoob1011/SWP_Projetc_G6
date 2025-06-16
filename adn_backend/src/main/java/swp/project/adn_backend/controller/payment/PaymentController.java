package swp.project.adn_backend.controller.payment;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.InvoiceDTO;
import swp.project.adn_backend.dto.request.payment.CreatePaymentRequest;
import swp.project.adn_backend.entity.Invoice;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.repository.InvoiceRepository;
import swp.project.adn_backend.service.payment.CreatePaymentService;
import swp.project.adn_backend.service.payment.InvoiceService;
import swp.project.adn_backend.dto.InfoDTO.PaymentInfoDTO;
import swp.project.adn_backend.service.payment.PaymentService;
import swp.project.adn_backend.service.payment.VNPayService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private PaymentService paymentService;
    private VNPayService vnPayService;
    private PaymentService getPaymentService;
    private CreatePaymentService createPaymentService;
    private InvoiceService invoiceService;

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

        @PostMapping("/create")
    public ResponseEntity<String> createPayment(
            @RequestParam long paymentId,
            @RequestParam long serviceId) {

        CreatePaymentRequest req = createPaymentService.createPayment(paymentId, serviceId);

        String paymentUrl = vnPayService.createOrder(
                (int)req.getAmount(), // truyền đúng đơn vị nhỏ nhất
                req.getOrderInfo(),
                req.getReturnUrlBase()
        );

        System.out.println("🔥 Controller called: paymentId=" + paymentId + ", serviceId=" + serviceId);

        return ResponseEntity.ok(paymentUrl);
    }
//    @PostMapping("/create")
//    public ResponseEntity<String> createPayment(
//            @RequestParam("amount") int amountVND, // đơn vị VNĐ
//            @RequestParam("orderInfo") String orderInfo,
//            @RequestParam("returnUrlBase") String returnUrlBase
//    ) {
//        // ✅ Chuyển sang đơn vị nhỏ nhất (x100)
//        int amountInSmallestUnit = amountVND * 100;
//
//        // ✅ Gọi service tạo URL thanh toán
//        String paymentUrl = vnPayService.createOrder(
//                amountInSmallestUnit,
//                orderInfo,
//                returnUrlBase
//        );
//
//        return ResponseEntity.ok(paymentUrl);
//    }


    @GetMapping("/vnpay-return")
    public ResponseEntity<InvoiceDTO> handleVNPayReturn(@RequestParam Map<String, String> params) {
        String vnpTxnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionStatus = params.get("vnp_TransactionStatus");

        if (!"00".equals(responseCode) || !"00".equals(transactionStatus)) {
            return ResponseEntity.badRequest().body(null);
        }

        return invoiceService.getInvoiceByTxnRef(vnpTxnRef)
                .map(invoice -> ResponseEntity.ok(new InvoiceDTO(invoice)))
                .orElse(ResponseEntity.status(404).body(null));
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
