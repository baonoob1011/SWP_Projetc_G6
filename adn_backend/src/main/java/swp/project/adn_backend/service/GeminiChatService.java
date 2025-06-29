package swp.project.adn_backend.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class GeminiChatService {


     String apiKey="AIzaSyD8gLg0uzrHc9fqOdA7izy3k1CbEyhyubY";

    private final OkHttpClient client = new OkHttpClient();

    public String chat(String userMessage) throws IOException {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        String prompt = """
                Chỉ trả lời câu hỏi liên quan đến dịch vụ dân sự (như giám định huyết thống) và hành chính (như xác nhận nhân thân).
                Nếu không liên quan, hãy nói: "Chúng tôi chỉ có dân sự và hành chính"
                
                Nếu người hỏi liên về cách đăng ký dịch vụ thì trả lời như sau:
                "Đầu tiên bạn phải vào mục Dịch vụ, chọn một trong hai lựa chọn: Dân sự hoặc Hành chính. 
                Sau đó, chọn hình thức thu mẫu: tại nhà hoặc tại cơ sở. 
                Cuối cùng, nhập thông tin bệnh nhân và xác nhận."
                
                Câu hỏi: %s
                """.formatted(userMessage);
        // Tạo JSON bằng ObjectMapper
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode textNode = mapper.createObjectNode();
        textNode.put("text", prompt);

        ObjectNode partNode = mapper.createObjectNode();
        partNode.set("parts", mapper.createArrayNode().add(textNode));

        ObjectNode root = mapper.createObjectNode();
        root.set("contents", mapper.createArrayNode().add(partNode));

        String requestBodyJson = mapper.writeValueAsString(root);

        Request request = new Request.Builder()
                .url(url)
                .post(RequestBody.create(
                        requestBodyJson,
                        MediaType.parse("application/json")))
                .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();
            JsonNode json = mapper.readTree(responseBody);
            JsonNode parts = json.at("/candidates/0/content/parts/0/text");
            return parts.isMissingNode()
                    ? "❌ Gemini không trả lời hoặc lỗi: " + responseBody
                    : parts.asText();
        }
    }

}

