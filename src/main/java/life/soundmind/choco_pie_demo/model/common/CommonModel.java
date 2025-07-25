package life.soundmind.choco_pie_demo.model.common;
import java.time.OffsetDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public class CommonModel {

    /** 사용여부 */
    @Column(nullable = false)
    @Schema(description = "사용여부 (true=사용, false=미사용)")
    private Boolean useYn = true;  // 기본값 true

    @Schema(description = "등록자")
    private String createdBy;

    @Schema(description = "수정자")
    private String updatedBy;

	/** 생성된시간 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private OffsetDateTime createdAt;

	/** 업데이트된시간 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private OffsetDateTime updatedAt;

}