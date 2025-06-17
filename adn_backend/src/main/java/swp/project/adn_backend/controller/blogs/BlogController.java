package swp.project.adn_backend.controller.blogs;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import swp.project.adn_backend.dto.request.blog.BlogRequest;
import swp.project.adn_backend.dto.request.blog.UpdateBlogRequest;
import swp.project.adn_backend.dto.response.BlogResponse;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.service.blog.BlogService;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
public class BlogController {
    @Autowired
    private BlogService blogService;
    
    @PostMapping(value = "/create-blog")
    public ResponseEntity<BlogResponse> createBlog(
        @RequestParam("title") String title,
        @RequestParam("content") String content,
        Authentication authentication,
        @RequestPart(value = "file", required = false) MultipartFile file) {
            
        BlogRequest blogRequest = new BlogRequest();
        blogRequest.setTitle(title);
        blogRequest.setContent(content);
        
        Blog createdBlog = blogService.createBlog(blogRequest, authentication, file);
        
        BlogResponse response = new BlogResponse(
            createdBlog.getBlogId(),
            createdBlog.getTitle(),
            createdBlog.getContent(),
            createdBlog.getImage(), // trả về ảnh trong response
            "Blog created successfully",
            true
        );
        
        return ResponseEntity.ok(response);
    }
    // @PostMapping(value = "/create-blog", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ResponseEntity<Blog> createBlog(@RequestBody @Valid BlogRequest blogRequest,
    //                                       Authentication authentication,
    //                                       @RequestPart(value = "file", required = false) MultipartFile file) {
    //     return ResponseEntity.ok(blogService.createBlog(blogRequest, authentication, file));
    // }


    
    @PutMapping(value = "/{blogId}")
    public ResponseEntity<BlogResponse> updateBlog(
        @PathVariable Long blogId,
        @RequestParam("title") String title,
        @RequestParam("content") String content,
        Authentication authentication,
        @RequestPart(value = "file", required = false) MultipartFile file) {
        UpdateBlogRequest updateRequest = new UpdateBlogRequest();
        updateRequest.setTitle(title);
        updateRequest.setContent(content);
        Blog updatedBlog = blogService.updateBlog(blogId, updateRequest, authentication, file);
        BlogResponse response = new BlogResponse(
            updatedBlog.getBlogId(),
            updatedBlog.getTitle(),
            updatedBlog.getContent(),
            updatedBlog.getImage(), // trả về ảnh trong response
            "Blog updated successfully",
            true
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa blog
     * @param blogId ID của blog cần xóa
     * @param authentication Thông tin xác thực của user
     * @return ResponseEntity với status 200 nếu xóa thành công
     */
    @DeleteMapping("/{blogId}")
    public ResponseEntity<BlogResponse> deleteBlog(
        @PathVariable Long blogId,
        Authentication authentication) {
        blogService.deleteBlog(blogId, authentication);
        return ResponseEntity.ok(new BlogResponse("Blog deleted successfully", true));
    }

    /**
     * Lấy danh sách tất cả blog
     * @return Danh sách blog
     */
    @GetMapping("/all")
    public ResponseEntity<List<BlogResponse>> getAllBlogs() {
        List<Blog> blogs = blogService.getAllBlogs();
        List<BlogResponse> responses = blogs.stream()
            .map(blog -> new BlogResponse(
                blog.getBlogId(),
                blog.getTitle(),
                blog.getContent(),
                blog.getImage(),
                "Blog retrieved successfully",
                true
            ))
            .toList();
        return ResponseEntity.ok(responses);
    }

    /**
     * Lấy blog theo ID
     * @param blogId ID của blog
     * @return Blog
     */
    @GetMapping("/{blogId}")
    public ResponseEntity<BlogResponse> getBlogById(@PathVariable Long blogId) {
        Blog blog = blogService.getBlogById(blogId);
        BlogResponse response = new BlogResponse(
            blog.getBlogId(),
            blog.getTitle(),
            blog.getContent(),
            blog.getImage(),
            "Blog retrieved successfully",
            true
        );
        return ResponseEntity.ok(response);
    }
}
