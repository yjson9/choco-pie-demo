package life.soundmind.choco_pie_demo.controller;

import java.util.ArrayList;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class TestController {
		
	@RequestMapping("/test")
	public String thymeleafTest(Model model) {
		 model.addAttribute("name", "asdb");
		 
		 List<String> testList = new ArrayList<String>();
		 testList.add("a");
		 testList.add("b");
		 testList.add("c");

		 model.addAttribute("list", testList);
		
		 return "test"; // 전송할 html 이름을 반환해 준다.
	}

	@RequestMapping("/companies")
	public String sampleCards(Model model) {
		 model.addAttribute("name", "asdb");
		 
		 List<String> testList = new ArrayList<String>();
		 testList.add("a");
		 testList.add("b");
		 testList.add("c");

		 model.addAttribute("list", testList);
		
		 return "pages/companies"; // 전송할 html 이름을 반환해 준다.
	}
    
}
