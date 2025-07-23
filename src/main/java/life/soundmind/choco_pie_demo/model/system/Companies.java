package life.soundmind.choco_pie_demo.model.system;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import life.soundmind.choco_pie_demo.model.common.CommonModel;
import lombok.*;

/**
 * <pre>
 * <b>Description  : 업체 모델클래스</b>
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
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor()
@Getter
@Setter
@Builder
@Entity(name = "companies") // 소문자필수
@Schema(description = "업체")
public class Companies extends CommonModel{

    @Id
    @Schema(description = "업체 id")
    private String id;

    @Schema(description = "업체명")
    private String name;

    @Schema(description = "업체전화번호")
    private String phone;

    @Schema(description = "사업자번호")
    private String businessId;

    @Schema(description = "업체메모")
    private String memo;

    @Schema(description = "사용여부")
    private String useYn;

}
