package swp.project.adn_backend.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.Roles;
import swp.project.adn_backend.repository.UserRepository;

import java.util.HashSet;

@Configuration
public class ApplicationInitConfig {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        return args -> {
            HashSet<String> roles = new HashSet<>();
            roles.add(Roles.ADMIN.name());
            if (userRepository.findByUsername("adminAccount").isEmpty()) {
                // Tạo user mới
                Users users = new Users();
                users.setUsername("adminAccount");
                users.setPassword(passwordEncoder.encode("admin"));
                users.setFullName("Tran Dinh Bao");
                users.setEmail("trandinhbao222@gmail.com");
                users.setRoles(roles);
                users.setPhone("0357594189");
                userRepository.save(users);
            }
        };
    }


}



