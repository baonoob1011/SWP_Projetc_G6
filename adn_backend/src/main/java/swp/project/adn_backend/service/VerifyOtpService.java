package swp.project.adn_backend.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerifyOtpService {

    private Map<String, String> otpStorage = new ConcurrentHashMap<>();

    public void saveOtp(String email, String otp) {
        System.out.println("OTP saved for " + email + ": " + otp);
        otpStorage.put(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {
        System.out.println("Verifying OTP for " + email + ": " + otp + ", stored: " + otpStorage.get(email));
        String savedOtp = otpStorage.get(email);
        return savedOtp != null && savedOtp.equals(otp);
    }


    public void clearOtp(String email) {
        otpStorage.remove(email);
    }
}

