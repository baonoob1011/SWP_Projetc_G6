package swp.project.adn_backend.dto.InfoDTO;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogResponse {
    long blogId;
    String title;
    String image;
    String content;
    LocalDate createdAt;

    public BlogResponse(long blogId, String title, String image, String content, LocalDate createdAt) {
        this.blogId = blogId;
        this.title = title;
        this.image = image;
        this.content = content;
        this.createdAt = createdAt;
    }

    public long getBlogId() {
        return blogId;
    }

    public void setBlogId(long blogId) {
        this.blogId = blogId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
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
