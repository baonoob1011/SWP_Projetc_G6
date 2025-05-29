package swp.project.adn_backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.dto.request.OtpRequest;
import swp.project.adn_backend.dto.request.OtpValidationRequest;
import swp.project.adn_backend.dto.request.OtpVerifyRequest;
import swp.project.adn_backend.dto.request.SmsRequest;
import swp.project.adn_backend.dto.response.OtpResponseDto;
import swp.project.adn_backend.service.EmailService;

import java.util.Random;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.service.OtpService;
import swp.project.adn_backend.service.UserService;

@RestController
@RequestMapping("/api/otp")
@Slf4j
public class OtpController {

    private UserService userService;
    private EmailService emailService;
    private OtpService otpService;


    @Autowired
    public OtpController(UserService userService, EmailService emailService, OtpService otpService) {
        this.userService = userService;
        this.emailService = emailService;
        this.otpService = otpService;

    }


    @PostMapping("/send")
    public ResponseEntity<String> sendOtp(@Valid @RequestBody OtpRequest request) {
        String otp = generateOtp();

        otpService.saveOtp(request.getEmail(), otp);

        emailService.sendOtpEmail(request.getEmail(), otp);

        return ResponseEntity.ok("OTP sent to " + request.getEmail());
    }


    private String generateOtp() {
        int otp = new Random().nextInt(900000) + 100000;
        return String.valueOf(otp);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpVerifyRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
        }

        return ResponseEntity.ok("OTP verified"); // cho phép frontend chuyển sang nhập mật khẩu
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody OtpVerifyRequest request) {
        // Có thể kiểm tra thêm nếu muốn, ví dụ: check email đã được xác thực OTP trước đó
        userService.updatePasswordByEmail(request.getEmail(), request.getNewPassword());
        otpService.clearOtp(request.getEmail());

        return ResponseEntity.ok("Password changed successfully.");
    }


}

