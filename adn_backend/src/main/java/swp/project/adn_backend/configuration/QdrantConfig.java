//package swp.project.adn_backend.configuration;
//
//import io.qdrant.client.QdrantClient;
//import io.qdrant.client.QdrantGrpcClient;
//import lombok.RequiredArgsConstructor;
//import org.springframework.ai.vectorstore.qdrant.QdrantVectorStore;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Primary;
//import org.springframework.ai.embedding.EmbeddingModel;
//
//@Configuration
//@RequiredArgsConstructor
//public class QdrantConfig {
//
//    @Value("${qdrant.host}")
//    private String qdrantHost;
//
//    @Value("${qdrant.port}")
//    private int qdrantPort;
//
//    @Value("${qdrant.secure}")
//    private boolean secure;
//
//    @Value("${qdrant.api.key}")
//    private String qdrantApiKey;
//
//    // Tạo QdrantClient
//    @Bean
//    @Primary
//    public QdrantClient qdrantClient() {
//        QdrantGrpcClient.Builder grpcClientBuilder = QdrantGrpcClient.newBuilder(
//                qdrantHost,
//                qdrantPort,
//                secure
//        ).withApiKey(qdrantApiKey);
//
//        return new QdrantClient(grpcClientBuilder.build());
//    }
//
//    // Tạo VectorStore sử dụng OpenAI embedding model
//    @Bean
//    public QdrantVectorStore qdrantVectorStore(
//            EmbeddingModel embeddingModel,
//            QdrantClient qdrantClient
//    ) {
//        return new QdrantVectorStore(qdrantClient, "FPOLY_AI_KNOWLEDGE", embeddingModel, true);
//    }
//}
