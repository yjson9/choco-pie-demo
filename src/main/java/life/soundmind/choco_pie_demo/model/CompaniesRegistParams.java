package life.soundmind.choco_pie_demo.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import life.soundmind.choco_pie_demo.model.common.CommonModel;
import java.util.List;
import lombok.*;

/**
 * <pre>
 * <b>Description  : 업체 등록 모델클래스</b>
 * <b>Project Name : choco-pie-demo.</b>
 * package  : life.soundmind.choco_pie_demo.model
 * </pre>
 *
 * @author : yjSon
 * @version : 1.0
 * @since <pre>
 * Modification Information
 *    수정일              수정자                수정내용
 * ---------------   ---------------   ----------------------------
 *  2025. 07. 22.        yjSon          최초생성
 * </pre>
 */
@Getter
@Setter
@NoArgsConstructor()
@ToString
@Schema(description = "업체 등록 파라미터")
public class CompaniesRegistParams {

    @Schema(description = "업체아이디")
    @NotBlank(message = "업체ID는 필수 항목입니다.")
    @Size(min = 7, max = 7, message = "업체ID는 7자리 입니다.")
    private String id;

    @Schema(description = "업체명")
    @NotBlank(message = "업체명은 필수 항목입니다.")
    @Size(max = 10, message = "업체명은 최대 10자리 입니다.")
    private String name;

    @Schema(description = "업체전화번호")
    private String phone;

    @Schema(description = "사업자번호")
    private String businessId;

    @Schema(description = "업체메모")
    private String memo;

    @Schema(description = "사용여부")
    private String useYn;

    @Schema(description = "등록자명")
    private String userId;

}
