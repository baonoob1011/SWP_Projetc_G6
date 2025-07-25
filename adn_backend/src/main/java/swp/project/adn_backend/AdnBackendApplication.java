package swp.project.adn_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class AdnBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AdnBackendApplication.class, args);
	}

}
