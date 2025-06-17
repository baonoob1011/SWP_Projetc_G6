package swp.project.adn_backend.service.blog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import swp.project.adn_backend.dto.request.blog.BlogRequest;
import swp.project.adn_backend.dto.request.blog.UpdateBlogRequest;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.BlogMapper;
import swp.project.adn_backend.repository.BlogRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

@Service
public class BlogService {

    private BlogMapper blogMapper;
    private UserRepository userRepository;
    private BlogRepository blogRepository;

    @Autowired
    public BlogService(BlogMapper blogMapper, UserRepository userRepository, BlogRepository blogRepository) {
        this.blogMapper = blogMapper;
        this.userRepository = userRepository;
        this.blogRepository = blogRepository;
    }

    public Blog createBlog(BlogRequest blogRequest,
                           Authentication authentication,
                           MultipartFile file) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users userCreated = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        Blog blog = blogMapper.toBlog(blogRequest);
        blog.setCreatedAt(LocalDate.now());
        blog.setUsers(userCreated);
        // Upload image if present
        if (file != null && !file.isEmpty()) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
                blog.setImage(base64Image);
            } catch (IOException e) {
                throw new AppException(ErrorCodeUser.INTERNAL_ERROR);
            }
        }
        return blogRepository.save(blog);
    }

    /**
     * Cập nhật thông tin blog
     * @param blogId ID của blog cần cập nhật
     * @param updateRequest Thông tin cập nhật
     * @param authentication Thông tin xác thực của user
     * @param file File ảnh mới (nếu có)
     * @return Blog đã được cập nhật
     */
    public Blog updateBlog(Long blogId, 
                         UpdateBlogRequest updateRequest,
                         Authentication authentication,
                         MultipartFile file) {
        // Kiểm tra quyền của user
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        
        // Tìm blog cần update
        Blog existingBlog = blogRepository.findById(blogId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.BLOG_NOT_FOUND));
        
        // Kiểm tra xem user có phải là người tạo blog hoặc có role ADMIN không
        if (existingBlog.getUsers().getUserId() != userId
            && !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AppException(ErrorCodeUser.USER_NOT_AUTHORIZED);
        }
        
        // Cập nhật thông tin
        existingBlog.setTitle(updateRequest.getTitle());
        existingBlog.setContent(updateRequest.getContent());
        
        // Cập nhật ảnh nếu có
        if (file != null && !file.isEmpty()) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
                existingBlog.setImage(base64Image);
            } catch (IOException e) {
                throw new AppException(ErrorCodeUser.INTERNAL_ERROR);
            }
        }
        return blogRepository.save(existingBlog);
    }
    /**
     * Lấy tất cả blog
     * @return Danh sách tất cả blog
     */
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }
    
    /**
     * Lấy blog theo ID
     * @param blogId ID của blog
     * @return Blog
     */
    public Blog getBlogById(Long blogId) {
        return blogRepository.findById(blogId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.BLOG_NOT_FOUND));
    }
    
    /**
     * Xóa blog
     * @param blogId ID của blog cần xóa
     * @param authentication Thông tin xác thực của user
     */
    public void deleteBlog(Long blogId, Authentication authentication) {
        // Kiểm tra quyền của user
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        
        // Tìm blog cần xóa
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.BLOG_NOT_FOUND));
        
        // Kiểm tra xem user có phải là người tạo blog hoặc có role ADMIN không
        if (blog.getUsers().getUserId() != userId
            && !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AppException(ErrorCodeUser.USER_NOT_AUTHORIZED);
        }
        
        blogRepository.delete(blog);
    }
}
