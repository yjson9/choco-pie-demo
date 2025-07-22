package life.soundmind.choco_pie_demo.model.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
@Data
@Schema(description = "처리 결과")
public class ResultModel {

    public static final String SUCCESS = "성공";
    public static final String FAIL = "처리 실패";

    /** 처리명 */
    @Schema(description = "처리명")
    private String name = "";

    /** 성공 건수 */
    @Schema(description = "성공 건수")
    private int successCnt = 0;

    /** 실패 건수 */
    @Schema(description = "실패 건수")
    private int errorCnt = 0;

    /** 리턴메시지 */
    @Schema(description = "리턴메시지")
    private String retMsg = "";

    /** 리턴코드 */
    @Schema(description = "리턴코드")
    private String retCode = "";

    public ResultModel() {
    }

    public ResultModel(String name, int successCnt, int errorCnt, String retMsg) {
        this.name = name;
        this.successCnt = successCnt;
        this.errorCnt = errorCnt;
        this.retMsg = retMsg;
    }

    public ResultModel(String name, int successCnt, int errorCnt, String retMsg, String retCode) {
        this(name, successCnt, errorCnt, retMsg);
        this.retCode = retCode;
    }

}
