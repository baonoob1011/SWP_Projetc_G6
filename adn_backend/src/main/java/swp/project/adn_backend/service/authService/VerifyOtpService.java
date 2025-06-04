package swp.project.adn_backend.service.authService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.repository.UserRepository;

import java.time.LocalDateTime;

@Service
public class VerifyOtpService {

    @Autowired
    private UserRepository userRepository;

    public void saveOtp(String email, String otp) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email does not exist."));

        user.setOtpCode(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(1)); // OTP hết hạn sau 1 phút
        userRepository.save(user);
    }

    public boolean verifyOtp(String email, String inputOtp) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email does not exist."));

        if (user.getOtpCode() == null || user.getOtpExpiryTime() == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiryTime())) {
            return false;
        }

        return user.getOtpCode().equals(inputOtp);
    }



    public void clearOtp(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email does not exist."));

        user.setOtpCode(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);
    }
}

