package life.soundmind.choco_pie_demo.model.system;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <pre>
 * <b>Description  : 업체 조회 파라미터 모델클래스</b>
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
@ToString
@Schema(description = "업체 조회 파라미터")
public class CompaniesParams {

    /** 업체명 */
    @Schema(description = "업체명")
    private String name;
}