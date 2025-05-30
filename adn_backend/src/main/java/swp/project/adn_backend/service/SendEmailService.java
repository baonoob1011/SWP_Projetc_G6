package swp.project.adn_backend.service;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.repository.UserRepository;

import java.util.Optional;

@Service
public class EmailService {

    private JavaMailSender mailSender;
    private UserRepository userRepository;
    @Autowired
    public EmailService(JavaMailSender mailSender, UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }

    public void sendOtpEmail(String toEmail, String otp) {
        Users user = userRepository.findByEmail(toEmail)
                .orElseThrow(() -> new RuntimeException("Email does not exist."));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is: " + otp);

        mailSender.send(message);
    }


}
