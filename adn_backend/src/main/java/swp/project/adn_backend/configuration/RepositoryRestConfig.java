package swp.project.adn_backend.configuration;


import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class RepositoryRestConfig implements RepositoryRestConfigurer {
    @Autowired
    private EntityManager entityManager;

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
//        HttpMethod[] chanCacPhuongThuc = {
//                HttpMethod.DELETE,
//                HttpMethod.PATCH,
//                HttpMethod.POST,
//                HttpMethod.PUT,
//        };
        //cho phep xuat id
        config.exposeIdsFor(entityManager.getMetamodel().getEntities().stream().map(Type::getJavaType).toArray(Class[]::new));
        //config.exposeIdsFor(TheLoai.class);

        // chan method
//
//            disableHttpMethod(TheLoai.class,config,chanCacPhuongThuc);
    }

    private void disableHttpMethod(Class c, RepositoryRestConfiguration config,
                                   HttpMethod[] methods) {
        config.getExposureConfiguration()
                .forDomainType(c)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(methods))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(methods));
    }
}

