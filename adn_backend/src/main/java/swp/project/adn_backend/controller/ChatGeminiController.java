package swp.project.adn_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.service.GeminiChatService;

import java.io.IOException;
import java.util.List;
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
    @GetMapping("/ask-bao-ai/presets")
    public List<String> getPresetQuestions() {
        return List.of(
                "Làm sao để đăng ký dịch vụ xét nghiệm ADN?",
                "Cơ sở có hỗ trợ thu mẫu tại nhà không?",
                "Tôi có thể tự lấy mẫu tại nhà không?",
                "Phân biệt dịch vụ dân sự và hành chính?",
                "Các loại mẫu nào được chấp nhận xét nghiệm?"
        );
    }

}
