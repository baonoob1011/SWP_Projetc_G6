package swp.project.adn_backend.exception;

import org.hibernate.query.SemanticException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import swp.project.adn_backend.dto.response.APIResponse;
import swp.project.adn_backend.enums.ErrorCodeUser;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalException {



    @ExceptionHandler(MultiFieldValidationException.class)
    public ResponseEntity<?> handleValidationException(MultiFieldValidationException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "message", "Validation Failed",
                "errors", ex.getErrors()
        ));
    }


    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<APIResponse> handlingRunTimeException(RuntimeException e) {
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setCode(1001);
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = UnsupportedOperationException.class)
    ResponseEntity<APIResponse> handlingUnsupportedOperationException(UnsupportedOperationException e) {
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setCode(1001);
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = MissingPathVariableException.class)
    ResponseEntity<APIResponse> handlingMissingPathVariableException(MissingPathVariableException e) {
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setCode(1001);
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }


    @ExceptionHandler(value = NoResourceFoundException.class)
    ResponseEntity<APIResponse> handlingNoResourceFoundException(NoResourceFoundException e) {
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setCode(1001);
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = SemanticException.class)
    ResponseEntity<APIResponse> handlingSemanticException(SemanticException e) {
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setCode(1001);
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = MissingServletRequestParameterException.class)
    ResponseEntity<APIResponse> handlingMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setCode(1001);
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();

        List<Map<String, String>> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> {
                    Map<String, String> errorDetail = new HashMap<>();
                    errorDetail.put("field", error.getField());
                    errorDetail.put("message", error.getDefaultMessage());
                    return errorDetail;
                })
                .collect(Collectors.toList());

        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("errors", errors);

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(value = InvalidDataAccessApiUsageException.class)
    ResponseEntity<APIResponse> handlingInvalidDataAccessApiUsageException(InvalidDataAccessApiUsageException e) {
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setCode(1001);
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = HttpMediaTypeNotSupportedException.class)
    ResponseEntity<APIResponse> handlingHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException e) {
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setCode(1001);
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<APIResponse> handlingAppException(AppException e) {
        ErrorCodeUser errorCode=e.getErrorCode();
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getHttpStatusCode()).body(apiResponse);
    }


    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<APIResponse> handlingAccessDeniedException(AccessDeniedException e) {
        ErrorCodeUser errorCode= ErrorCodeUser.UNAUTHORIZED;
        return ResponseEntity.status(errorCode.getHttpStatusCode()).body(
                APIResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }

    @ExceptionHandler(value = HttpRequestMethodNotSupportedException.class)
    ResponseEntity<APIResponse> handlingHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setCode(1003);
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

//    @ExceptionHandler(value = MethodArgumentNotValidException.class)
//    ResponseEntity<APIResponse> handlingMethodArgumentNotValidException(MethodArgumentNotValidException e) {
//        String enumKey=e.getFieldError().getDefaultMessage();
//
//        ErrorCodeUser errorCode= ErrorCodeUser.valueOf(enumKey);
//        APIResponse apiResponse = new APIResponse<>();
//
//        apiResponse.setCode(errorCode.getCode());
//        apiResponse.setMessage(errorCode.getMessage());
//        return ResponseEntity.badRequest().body(apiResponse);
//    }


}
