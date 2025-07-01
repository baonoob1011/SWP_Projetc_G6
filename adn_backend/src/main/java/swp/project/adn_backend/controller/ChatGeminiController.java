package swp.project.adn_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.service.GeminiChatService;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatGeminiController {
    @Autowired
    private  GeminiChatService geminiChatService;

    @PostMapping("/ask-bao-ai")
    public String ask(@RequestBody Map<String, String> req) throws IOException {
        return geminiChatService.chat(req.get("question"));
    }
}
