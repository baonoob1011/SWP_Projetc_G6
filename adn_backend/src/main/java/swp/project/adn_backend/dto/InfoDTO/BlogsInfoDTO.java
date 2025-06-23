package swp.project.adn_backend.dto.InfoDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;

public class BlogsInfoDTO {
    long blogId;
    String title;
    String content;
    private String image;

    public BlogsInfoDTO(long blogId, String title, String content, String image) {
        this.blogId = blogId;
        this.title = title;
        this.content = content;
        this.image = image;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
