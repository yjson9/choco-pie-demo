package life.soundmind.choco_pie_demo.common.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.validation.BindingResult;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ErrorResponse {
    private int status;
    private String message;
    private String code;
    private List<FieldError> errors;
    private String errorMessage;

    private ErrorResponse(ErrorCode errorCode, List<FieldError> errors) {
        this.status = errorCode.getStatus();
        this.message = errorCode.getMessage();
        this.code = errorCode.getCode();
        this.errors = errors;
        this.errorMessage = errors.get(0).reason == null ? errorCode.getMessage() : errors.get(0).reason;
    }

    private ErrorResponse(ErrorCode errorCode) {
        this.status = errorCode.getStatus();
        this.message = errorCode.getMessage();
        this.code = errorCode.getCode();
        this.errors = new ArrayList<>();
        this.errorMessage = errorCode.getMessage();
    }

    private ErrorResponse(ErrorCode errorCode, String errorMessage) {
        this.status = errorCode.getStatus();
        this.message = errorCode.getMessage();
        this.code = errorCode.getCode();
        this.errors = new ArrayList<>();
        this.errorMessage = errorMessage;
    }

    public static ErrorResponse of(final ErrorCode errorCode, final BindingResult bindingResult) {
        return new ErrorResponse(errorCode, FieldError.of(bindingResult));
    }

    public static ErrorResponse of(final ErrorCode errorCode) {
        return new ErrorResponse(errorCode);
    }

    public static ErrorResponse of(final ErrorCode errorCode, final String errorMessage) {
        return new ErrorResponse(errorCode, errorMessage);
    }

    public static ErrorResponse of(final ErrorCode errorCode, final List<FieldError> errors) {
        return new ErrorResponse(errorCode, errors);
    }

    public static ErrorResponse of(MethodArgumentTypeMismatchException e) {
        final String value = e.getValue() == null ? "" : e.getValue().toString();
        final List<ErrorResponse.FieldError> errors = ErrorResponse.FieldError.of(e.getName(), value, e.getErrorCode());
        return new ErrorResponse(ErrorCode.INVALID_INPUT_VALUE, errors);
    }

    public static ErrorResponse of(DataIntegrityViolationException e) {
        String errorMessage = e.getCause() == null ? "" : String.valueOf(e.getCause());
        // 에러메시지 수정 java.sql.SQLIntegrityConstraintViolationException: (conn=15463) Column 'order' cannot be null -> Column 'order' cannot be null
        if (errorMessage.contains(":")) {
            errorMessage = errorMessage.substring(errorMessage.indexOf(":") + 1);
        }
        if (errorMessage.contains("(conn")) {
            errorMessage = errorMessage.substring(errorMessage.indexOf(")") + 2);
        }
        return new ErrorResponse(ErrorCode.INVALID_INPUT_VALUE, errorMessage);
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class FieldError {
        private String field;
        private String value;
        private String reason;

        private FieldError(final String field, final String value, final String reason) {
            this.field = field;
            this.value = value;
            this.reason = reason;
        }

        public static List<FieldError> of(final String field, final String value, final String reason) {
            List<FieldError> fieldErrors = new ArrayList<>();
            fieldErrors.add(new FieldError(field, value, reason));
            return fieldErrors;
        }

        private static List<FieldError> of(final BindingResult bindingResult) {
            final List<org.springframework.validation.FieldError> fieldErrors = bindingResult.getFieldErrors();
            return fieldErrors.stream()
                    .map(error -> new FieldError(
                            error.getField(),
                            error.getRejectedValue() == null ? "" : error.getRejectedValue().toString(),
                            error.getDefaultMessage()))
                    .collect(Collectors.toList());
        }
    }

}

