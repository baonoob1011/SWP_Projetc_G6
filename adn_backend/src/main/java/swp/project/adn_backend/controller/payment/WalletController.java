package swp.project.adn_backend.controller.payment;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.PaymentInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.WalletInfoAmountDTO;
import swp.project.adn_backend.dto.InfoDTO.WalletTransitionDTO;
import swp.project.adn_backend.dto.InfoDTO.WalletTransitionInfoDTO;
import swp.project.adn_backend.dto.request.payment.CreatePaymentRequest;
import swp.project.adn_backend.dto.request.payment.WalletRequest;
import swp.project.adn_backend.repository.WalletTransactionRepository;
import swp.project.adn_backend.service.payment.CreatePaymentService;
import swp.project.adn_backend.service.payment.PaymentService;
import swp.project.adn_backend.service.payment.VNPayService;
import swp.project.adn_backend.service.registerServiceTestService.AppointmentService;
import swp.project.adn_backend.service.wallet.WalletService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private PaymentService paymentService;
    private VNPayService vnPayService;
    private PaymentService getPaymentService;
    private CreatePaymentService createPaymentService;
    private WalletTransactionRepository walletTransactionRepository;
    private WalletService walletService;
    private AppointmentService appointmentService;

    @Autowired
    public WalletController(PaymentService paymentService, VNPayService vnPayService, PaymentService getPaymentService, CreatePaymentService createPaymentService, WalletTransactionRepository walletTransactionRepository, WalletService walletService, AppointmentService appointmentService) {
        this.paymentService = paymentService;
        this.vnPayService = vnPayService;
        this.getPaymentService = getPaymentService;
        this.createPaymentService = createPaymentService;
        this.walletTransactionRepository = walletTransactionRepository;
        this.walletService = walletService;
        this.appointmentService = appointmentService;
    }

    @GetMapping("/get-all-payment")
    public ResponseEntity<List<PaymentInfoDTO>> getAllPayment(Authentication authentication) {
        return ResponseEntity.ok(paymentService.getAllPayment(authentication));
    }
    @GetMapping("/get-all-wallet-transition")
    public ResponseEntity<List<WalletTransitionDTO>> getWalletTransition(Authentication authentication) {
        return ResponseEntity.ok(createPaymentService.getWalletTransition(authentication));
    }
    @PostMapping("/payment-by-wallet")
    public ResponseEntity<CreatePaymentRequest> createPaymentByWallet(Authentication authentication,
                                                                      @RequestParam long appointmentId,
                                                                      @RequestParam long serviceId,
                                                                      @RequestParam long paymentId) {
        return ResponseEntity.ok(appointmentService.createPaymentByWallet(paymentId,
                serviceId,
                appointmentId,
                authentication));
    }

    @PostMapping("/create")
    public ResponseEntity<String> createPayment(@RequestBody  WalletRequest walletRequest, Authentication authentication) {

        CreatePaymentRequest req = createPaymentService.CreateWallet(authentication, walletRequest);

        // ép kiểu đúng: double -> long -> int
        int amount = Math.toIntExact((long) req.getAmount());
        System.out.println(amount);
        String paymentUrl = vnPayService.createOrder(
                amount,
                req.getOrderInfo(),
                req.getTxnRef(),
                req.getReturnUrlBase()
        );

        return ResponseEntity.ok(paymentUrl);
    }


    @GetMapping("/vnpay-return")
    public ResponseEntity<WalletTransitionInfoDTO> handleVNPayReturn(@RequestParam Map<String, String> params) {
        String vnpTxnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionStatus = params.get("vnp_TransactionStatus");
        if (!"00".equals(responseCode) || !"00".equals(transactionStatus)) {
            createPaymentService.failPaymentWallet(vnpTxnRef);
        }
        createPaymentService.successPaymentWallet(vnpTxnRef);
        return walletTransactionRepository.findByTxnRef(vnpTxnRef)
                .map(Wallet -> ResponseEntity.ok(new WalletTransitionInfoDTO(Wallet)))
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
    @GetMapping("/get-amount")
    public ResponseEntity<WalletInfoAmountDTO> getWalletAmount(Authentication authentication) {
        return ResponseEntity.ok(walletService.getWalletAmount(authentication));
    }

//    @GetMapping("/return-order-payment")
//    public
}
