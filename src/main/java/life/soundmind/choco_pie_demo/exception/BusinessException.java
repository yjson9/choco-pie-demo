package life.soundmind.choco_pie_demo.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }


    public BusinessException(ErrorCode errorCode, Map<String, String> fields) {
        super(getFieldStringMessage(errorCode.getMessage(), fields));
        this.errorCode = errorCode;
    }

    public static String getFieldStringMessage(String message, Map<String, String> fields) {

        final String[] result = {message};

        if (fields != null && !fields.isEmpty()) {
            fields.forEach((key, value) -> {
                String field = "\\{" + key + "\\}";
                result[0] = result[0].replaceAll(field, value);
            });
        }
        return result[0];
    }

}
