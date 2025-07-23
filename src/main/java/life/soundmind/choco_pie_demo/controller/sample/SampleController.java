package life.soundmind.choco_pie_demo.controller.sample;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.RequiredArgsConstructor;


@Controller
@RequiredArgsConstructor
public class SampleController {

    @GetMapping("/sample")
    public String getSample() {
        return "pages/sample/list";
    }
    
}
