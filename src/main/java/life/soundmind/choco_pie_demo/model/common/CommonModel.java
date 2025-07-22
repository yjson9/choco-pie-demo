package life.soundmind.choco_pie_demo.model.common;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.*;

@Getter
@Setter
@MappedSuperclass
public class CommonModel {

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

    // 엔티티가 처음 저장될 때 호출
    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now(); // 생성일자 설정
        }
        if (updatedAt == null) {
            updatedAt = OffsetDateTime.now(); // 수정일자 설정
        }
    }

    // 엔티티가 수정될 때 호출
    @PreUpdate
    public void preUpdate() {
        updatedAt = OffsetDateTime.now(); // 수정일자만 갱신
    }

}