package swp.project.adn_backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import swp.project.adn_backend.controller.chat.ChatController;
import swp.project.adn_backend.entity.ChatMessage;
import swp.project.adn_backend.enums.MessageType;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class AdnBackendApplicationTests {

	@Autowired
	private ChatController chatController;

	@Test
	public void testSendMessage() {
		ChatMessage message = new ChatMessage();
		message.setSender("Alice");
		message.setContent("Hello");
		message.setType(MessageType.CHAT);

		ChatMessage response = chatController.sendMessage(message);

		assertEquals("Alice", response.getSender());
		assertEquals("Hello", response.getContent());
	}
}
