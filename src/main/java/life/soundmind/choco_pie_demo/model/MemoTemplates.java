package life.soundmind.choco_pie_demo.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import life.soundmind.choco_pie_demo.model.common.CommonModel;
import lombok.*;

/**
 * <pre>
 * <b>Description  : 메모양식 모델클래스</b>
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
@Entity(name = "memo_templates") // 소문자필수
@Schema(description = "메모양식")
public class MemoTemplates extends CommonModel{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    @Schema(description = "대리점ID")
    private String storeId;

    @Column(nullable = false)
    @Schema(description = "시퀀스")
    private int seq;

    @Schema(description = "메모라벨")
    private String Label;

    @Schema(description = "메모값")
    private String expression;

}
