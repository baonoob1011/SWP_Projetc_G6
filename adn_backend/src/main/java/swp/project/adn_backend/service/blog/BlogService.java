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
}
