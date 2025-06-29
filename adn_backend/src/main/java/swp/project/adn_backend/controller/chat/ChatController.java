package swp.project.adn_backend.controller.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.entity.ChatMessage;

@RestController
//@RequestMapping("/api/chat")
public class ChatController {
    @MessageMapping("/chat.sendMessage")
    @SendTo("topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage
    ) {
        return chatMessage;
    }
    @MessageMapping("/chat.addUser")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        // Add username in WebSocket session attributes
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }

}
