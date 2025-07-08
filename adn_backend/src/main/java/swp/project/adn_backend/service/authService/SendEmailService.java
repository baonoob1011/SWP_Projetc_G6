package swp.project.adn_backend.service.authService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.repository.UserRepository;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class SendEmailService {

    private JavaMailSender mailSender;
    private UserRepository userRepository;
    @Autowired
    public SendEmailService(JavaMailSender mailSender, UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }

    public void sendOtpEmail(String toEmail, String otp) {
        Users user = userRepository.findByEmail(toEmail)
                .orElseThrow(() -> new RuntimeException("Email ís existed."));

        // Check if the last OTP was sent within the last 1 minute
        if (user.getLastOtpSentTime() != null) {
            LocalDateTime now = LocalDateTime.now();
            if (Duration.between(user.getLastOtpSentTime(), now).toMinutes() < 1) {
                throw new RuntimeException("Please wait 1 minute before requesting a new OTP.");
            }
        }

        // Proceed to send OTP
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is: " + otp);
        mailSender.send(message);

        // Update last OTP sent time
        user.setLastOtpSentTime(LocalDateTime.now());
        userRepository.save(user);
    }

    public void sendEmailCreateAccountSuccessful(String toEmail, String emailContent) {
        Users user = userRepository.findByEmail(toEmail)
                .orElseThrow(() -> new RuntimeException("Email does not exist."));

        // Proceed to send welcome email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to ADN Medical Center");
        message.setText(emailContent);
        mailSender.send(message);
    }



}
