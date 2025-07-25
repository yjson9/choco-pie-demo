package life.soundmind.choco_pie_demo.controller.sample;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import life.soundmind.choco_pie_demo.common.exception.ErrorCode;
import life.soundmind.choco_pie_demo.model.common.CommonResponse;
import life.soundmind.choco_pie_demo.model.sample.Sample;
import life.soundmind.choco_pie_demo.service.sample.SampleService;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("api/")
@Tag(name = "sample", description = "sample API")
public class SampleApiController {

    private final SampleService sampleService;


    @Operation(summary = "sample 목록조회", description = "sample 목록조회", tags = "sample")
    @ApiResponse(responseCode = "200", description = "successful operation", content = @Content(schema = @Schema(implementation = Sample.class)))
    @GetMapping("samples")
    public ResponseEntity<CommonResponse<?>> getSamples() {
        List<Sample> result = sampleService.getSamples();
        return ResponseEntity.ok(CommonResponse.success(ErrorCode.OK, result));
    }
    
}
