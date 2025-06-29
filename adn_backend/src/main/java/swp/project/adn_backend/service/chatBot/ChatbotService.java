//package swp.project.adn_backend.service.chatBot;
//
//import com.openai.client.OpenAIClient;
//import com.openai.api.chat.ChatCompletion;
//import com.openai.api.chat.ChatCompletionChoice;
//import com.openai.api.chat.ChatCompletionMessage;
//import com.openai.api.chat.ChatCompletionRequest;
//import com.openai.api.chat.Role;
//
//import java.util.List;
//
//public class ChatService {
//
//    private final OpenAIClient client;
//
//    public ChatService(String apiKey) {
//        this.client = OpenAIClient.builder()
//                .apiKey(apiKey)
//                .build();
//    }
//
//    public String chat(String userInput) {
//        ChatCompletionRequest request = ChatCompletionRequest.builder()
//                .model("gpt-3.5-turbo")
//                .messages(List.of(
//                        ChatCompletionMessage.builder()
//                                .role(Role.SYSTEM)
//                                .content("You are a helpful assistant.")
//                                .build(),
//                        ChatCompletionMessage.builder()
//                                .role(Role.USER)
//                                .content(userInput)
//                                .build()
//                ))
//                .build();
//
//        ChatCompletion completion = client.chatCompletion().create(request);
//        ChatCompletionChoice choice = completion.getChoices().get(0);
//        return choice.getMessage().getContent();
//    }
//}
