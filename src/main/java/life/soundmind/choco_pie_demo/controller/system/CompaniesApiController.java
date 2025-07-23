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
import jakarta.validation.Valid;
import life.soundmind.choco_pie_demo.model.common.ResultModel;
import life.soundmind.choco_pie_demo.model.system.Companies;
import life.soundmind.choco_pie_demo.model.system.CompaniesParams;
import life.soundmind.choco_pie_demo.model.system.CompaniesRegistParams;
import life.soundmind.choco_pie_demo.service.system.CompaniesService;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 * <b>Description  : 업체 컨트롤러</b>
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
@Tag(name = "Companies", description = "업체 API")
public class CompaniesApiController {


    /**
     * 업체 서비스
     */
    private final CompaniesService service;

    /**
     * <PRE>
     * <b>업체 컨트롤러 클래스의 생성자 </b>
     * </PRE>
     *
     * @param service 업체 서비스
     */
    public CompaniesApiController(CompaniesService service) {
        this.service = service;
    }

    /**
     * <PRE>
     * <b>업체 목록조회</b>
     * </PRE>
     * <p>
     * method : selectCompaniesList
     *
     * @return 업체목록정보 리턴
     */
    @Operation(summary = "업체 목록조회", description = "업체 목록조회", tags = "Companies")
    @ApiResponse(responseCode = "200", description = "successful operation", content = @Content(schema = @Schema(implementation = Companies.class)))
    @GetMapping("/companies")
    public ResponseEntity<Object> selectCompaniesList(@ParameterObject CompaniesParams params) {

        if (log.isDebugEnabled()) {
            log.debug(":::: selectCompaniesList :::: selectCompaniesList params : {}", params.toString());
        }
        return ResponseEntity.ok(this.service.selectCompaniesList(params));
    }

    /**
     * <PRE>
     * <b>업체 단건 조회</b>
     * </PRE>
     * <p>
     * method : selectCompanies
     *
     * @return 업체정보 리턴
     */
    @Operation(summary = "업체 정보", description = "업체 정보", tags = "Companies")
    @ApiResponse(responseCode = "200", description = "successful operation", content = @Content(schema = @Schema(implementation = Companies.class)))
    @GetMapping("/companies/{id}")
    public ResponseEntity<Object> selectCompanies(@PathVariable(value = "id") String id) {

        if (log.isDebugEnabled()) {
            log.debug(":::: selectCompanies :::: {}", id);
        }
        return ResponseEntity.ok(this.service.selectCompanies(id));
    }

    /**
     * <PRE>
     * <b>업체 전체 목록 조회(JAP)</b>
     * </PRE>
     * <p>
     * method : selectAllCompaniesList
     *
     * @return List<Companies> 업체 전체 목록 조회
     */
    @Operation(summary = "업체 전체 목록 조회", description = "업체 전체 목록 조회", tags = "Companies")
    @ApiResponse(responseCode = "200", description = "successful operation", content = @Content(schema = @Schema(implementation = Companies.class)))
    @GetMapping("/companies/all")
    public ResponseEntity<Object> selectAllCompaniesList() {
        
        return ResponseEntity.ok(this.service.selectAllCompaniesList());
    }

    /**
     * <PRE>
     * <b>업체 목록등록</b>
     * </PRE>
     * <p>
     * method : registCompanies
     *
     * @return 업체목록정보 리턴
     */
    @Operation(summary = "업체 수정", description = "업체 수정", tags = "Companies")
    @ApiResponse(responseCode = "200", description = "successful operation", content = @Content(schema = @Schema(implementation = ResultModel.class)))
    @PostMapping("/companies")
    public ResponseEntity<Object> registCompanies(@RequestBody @Valid List<CompaniesRegistParams> paramsList) {

        if (log.isDebugEnabled()) {
            log.debug(":::: registCompanies :::: List<CompaniesRegistParams> paramsList : {}", paramsList.toString());
        }
        return ResponseEntity.ok(this.service.registCompanies(paramsList));
    }

}
