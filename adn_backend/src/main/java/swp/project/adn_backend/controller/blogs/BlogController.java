package swp.project.adn_backend.controller.blogs;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import swp.project.adn_backend.dto.request.Blogs.BlogRequest;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.service.blog.BlogService;

@RestController
@RequestMapping("/api/blog")
public class BlogController {
    @Autowired
    private BlogService blogService;

    @PostMapping(value = "/create-blog", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Blog> creteBlog(@RequestBody @Valid BlogRequest blogRequest,
                                          Authentication authentication,
                                          @RequestPart(value = "file", required = false) MultipartFile file
                                          ) {
        return ResponseEntity.ok(blogService.createBlog(blogRequest, authentication,file));
    }
}
