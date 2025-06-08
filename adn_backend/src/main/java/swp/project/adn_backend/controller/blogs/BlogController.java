package swp.project.adn_backend.controller.blogs;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.dto.request.Blogs.BlogRequest;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.service.blog.BlogService;

@RestController
@RequestMapping("/api/blog")
public class BlogController {
    @Autowired
    private BlogService blogService;

    @PostMapping("/create-blog")
    public ResponseEntity<Blog> creteBlog(@RequestBody @Valid BlogRequest blogRequest, Authentication authentication) {
        return ResponseEntity.ok(blogService.createBlog(blogRequest, authentication));
    }
}
