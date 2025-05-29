package swp.project.adn_backend.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.repository.UserRepository;

import java.util.HashSet;
import java.util.Properties;
@Slf4j
@Configuration
public class ApplicationInitConfig {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("adminAccount").isEmpty()) {
                var roles = new HashSet<String>();
                roles.add(Roles.ADMIN.name());
                Users users = new Users();
                users.setUsername("adminAccount");
                users.setPassword(passwordEncoder.encode("admin"));
                users.setRoles(roles);
//                        .username("adminAccount")
//                        .password(passwordEncoder.encode("admin"))
//                        .roles(roles)
//                        .build();
                userRepository.save(users);
            }
        };
    }


}
