package life.soundmind.choco_pie_demo.controller.system;

import java.util.List;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import life.soundmind.choco_pie_demo.service.system.MemosService;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 * <b>Description  : 메모 컨트롤러</b>
 * <b>Project Name : choco-pie-demo</b>
 * package  : life.soundmind.choco_pie_demo.controller
 * </pre>
 *
 * @author : yjson
 * @version : 1.0
 * @since <pre>
 * Modification Information
 *    수정일              수정자                수정내용
 * ---------------   ---------------   ----------------------------
 *  2025.07.22        yjson           최초생성
 * </pre>
 */
@Slf4j
@RestController
@RequestMapping("/api/choco-pie")
@Tag(name = "Memos", description = "메모 API")
public class MemosApiController {


    /**
     * 메모 서비스
     */
    private final MemosService service;

    /**
     * <PRE>
     * <b>메모 컨트롤러 클래스의 생성자 </b>
     * </PRE>
     *
     * @param service 메모 서비스
     */
    public MemosApiController(MemosService service) {
        this.service = service;
    }
    /**
     * <PRE>
     * <b>메모 텍스트 조회</b>
     * </PRE>
     * <p>
     * method : selectMemos
     *
     * @return 메모문자열 리턴
     */
    @Operation(summary = "메모 정보", description = "메모 정보", tags = "Memos")
    @ApiResponse(responseCode = "200", description = "successful operation", content = @Content(schema = @Schema(implementation = String.class)))
    @GetMapping("/Memos/{store_id}/{id}")
    public ResponseEntity<Object> selectMemoTexts(@PathVariable(value = "store_id") String storeId, @PathVariable(value = "id") String id) {

        if (log.isDebugEnabled()) {
            log.debug(":::: selectMemos :::: {}", id);
        }
        return ResponseEntity.ok(this.service.selectMemoTexts(storeId, id));
    }
}
