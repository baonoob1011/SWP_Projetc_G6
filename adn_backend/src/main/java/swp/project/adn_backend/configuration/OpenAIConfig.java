//package swp.project.adn_backend.configuration;
//
//import com.openai.client.OpenAIClient;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class OpenAIConfig {
//
//    @Value("${openai.api.key}")
//    private String apiKey;
//
//    @Bean
//    public OpenAIClient openAiClient() {
//        return OpenAIClient.builder()
//                .apiKey(apiKey)
//                .build();
//    }
//}
