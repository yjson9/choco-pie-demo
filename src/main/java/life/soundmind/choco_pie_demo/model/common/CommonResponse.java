package life.soundmind.choco_pie_demo.model.common;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import life.soundmind.choco_pie_demo.common.exception.ErrorCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommonResponse<T> {

    private boolean status;

    private String message;

    private String code;

    private LocalDateTime dateTime;

    private T data;

    /*
     * 성공 응답 생성자 (data 포함)
     */
    public CommonResponse(ErrorCode errorCode, T data) {
        this.status = true;
        this.message = errorCode.getMessage();
        this.code = errorCode.getCode();
        this.data = data;
        this.dateTime = LocalDateTime.now();
    }

    /*
     * 성공 응답 생성자 (data 없음)
     */
    private CommonResponse(ErrorCode errorCode) {
        this(errorCode, null);
    }

    /*
     * 예외 응답 생성자 (오류 코드 기반)
     */
    public CommonResponse(boolean status, String message, String code) {
        this.status = status;
        this.message = message;
        this.code = code;
        this.dateTime = LocalDateTime.now();
    }

    /*
     * 커스텀 응답 생성자
     */
    public CommonResponse(boolean status, String message, String code, T data) {
        this.status = status;
        this.message = message;
        this.code = code;
        this.data = data;
        this.dateTime = LocalDateTime.now();
    }

    /*
     * 성공 응답 반환 (data 포함)
     */
    public static <T> CommonResponse<T> success(ErrorCode errorCode, T data) {
        return new CommonResponse<>(errorCode, data);
    }

    /*
     * 성공 응답 반환 (data 없음)
     */
    public static <T> CommonResponse<T> success(ErrorCode errorCode) {
        return new CommonResponse<>(errorCode);
    }

    /*
     * 실패 응답 반환 (오류 코드 기반)
     */
    public static <T> CommonResponse<T> fail(ErrorCode errorCode) {
        return new CommonResponse<>(false, errorCode.getMessage(), errorCode.getCode());
    }

    /*
     * 커스텀 응답 반환
     */
    public static <T> CommonResponse<T> custom(boolean status, String message, String code, T data) {
        return new CommonResponse<>(status, message, code, data);
    }
}
