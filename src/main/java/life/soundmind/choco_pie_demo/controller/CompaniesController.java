package life.soundmind.choco_pie_demo.controller;

import java.util.List;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.validation.Valid;
import life.soundmind.choco_pie_demo.model.Companies;
import life.soundmind.choco_pie_demo.model.CompaniesParams;
import life.soundmind.choco_pie_demo.model.CompaniesRegistParams;
import life.soundmind.choco_pie_demo.service.CompaniesService;
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
 *  2025. 07. 22.        yjSon          최초생성
 * </pre>
 */
@Slf4j
@Controller
@RequestMapping("/choco-pie")
public class CompaniesController {


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
    public CompaniesController(CompaniesService service) {
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
    @GetMapping("/companies")
    public String selectCompaniesList(@ParameterObject CompaniesParams params, Model model) {

        if (log.isDebugEnabled()) {
            log.debug(":::: selectCompaniesList :::: selectCompaniesList params : {}", params.toString());
        }

        List<Companies> companies = this.service.selectCompaniesList(params);
        model.addAttribute("companies", companies);

        return "pages/companies :: companyRows";
    }
}

