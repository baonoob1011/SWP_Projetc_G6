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
                Bạn là trợ lý tư vấn cho khách hàng về dịch vụ xét nghiệm ADN của trung tâm ADN Medical Center.
                
                Vui lòng trả lời rõ ràng và chính xác, tập trung vào các nội dung như: cách đăng ký dịch vụ, thu mẫu tại nhà, các loại mẫu được chấp nhận, thời gian trả kết quả, phân biệt dịch vụ dân sự và hành chính.
                
                Nếu câu hỏi nằm ngoài các chủ đề này, vẫn trả lời một cách lịch sự nhất có thể.
                
                Viết ngắn gọn nhất có thể chỉ 4 5 hàng
                cơ sở tên là ADN GENELINK
                , đây là cách đăng ký đầu tiên là chọn dịch vụ theo ý muốn của bạn xong chọn thu mẫu tại nhà hoặc tại cơ sở,
                nếu chọn tại cơ sợ thì bạn chọn thời gian và chi nhánh phù hợp, còn tại nhà thì nhân viên sẽ gửi kit đế nhà rồi bạn tự thu
                Câu hỏi của khách hàng: "%s"
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

