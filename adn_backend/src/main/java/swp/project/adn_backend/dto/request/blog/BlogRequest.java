package swp.project.adn_backend.dto.request.blog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogRequest {

    @NotBlank(message = "Title must not be blank")
    @Size(max = 100, message = "Title must be at most 100 characters")
    private String title;

    String image;
    private String content;
    LocalDate createdAt;

    public @NotBlank(message = "Title must not be blank") @Size(max = 100, message = "Title must be at most 100 characters") String getTitle() {
        return title;
    }

    public void setTitle(@NotBlank(message = "Title must not be blank") @Size(max = 100, message = "Title must be at most 100 characters") String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
}
