package swp.project.adn_backend.exception;

import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import swp.project.adn_backend.dto.response.APIResponse;
import swp.project.adn_backend.enums.ErrorCodeUser;

import java.nio.file.AccessDeniedException;

@ControllerAdvice
public class GlobalException {
    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<APIResponse> handlingRunTimeException(RuntimeException e) {
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setCode(1001);
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<APIResponse> handlingMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        APIResponse apiResponse = new APIResponse<>();
        apiResponse.setCode(1001);
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
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
