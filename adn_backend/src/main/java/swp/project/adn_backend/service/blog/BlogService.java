package swp.project.adn_backend.service.blog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import swp.project.adn_backend.dto.request.blog.BlogRequest;
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

    public Blog updateBlog(Long blogId, BlogRequest blogRequest, Authentication authentication, MultipartFile file) {
        // Lấy user từ authentication (giống createBlog)
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        // Tìm blog cần cập nhật
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.BLOG_NOT_FOUND));

        // Kiểm tra quyền sửa (nếu cần, ví dụ chỉ cho phép user tạo blog được sửa)
        if (!Long.valueOf(blog.getUsers().getUserId()).equals(userId)) {
            throw new AppException(ErrorCodeUser.UNAUTHORIZED);
        }

        // Cập nhật các trường từ blogRequest
        blog.setTitle(blogRequest.getTitle());
        blog.setContent(blogRequest.getContent());
        // ... các trường khác nếu có

        // Nếu có file ảnh mới, cập nhật ảnh
        if (file != null && !file.isEmpty()) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
                blog.setImage(base64Image);
            } catch (IOException e) {
                throw new AppException(ErrorCodeUser.INTERNAL_ERROR);
            }
        }

        // Lưu lại blog đã cập nhật
        return blogRepository.save(blog);
    }

    public void deleteBlog(Long blogId, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.BLOG_NOT_FOUND));
        if (!Long.valueOf(blog.getUsers().getUserId()).equals(userId)) {
            throw new AppException(ErrorCodeUser.UNAUTHORIZED);
        }
        blogRepository.delete(blog);
    }
}
