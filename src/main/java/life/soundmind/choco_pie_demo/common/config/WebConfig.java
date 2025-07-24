package life.soundmind.choco_pie_demo.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // URL 경로와 템플릿 매핑
        //registry.addViewController("/").setViewName("index"); // / -> index.html
        registry.addViewController("/").setViewName("pages/dashboard/dash-board"); // / -> index.html
        
        // registry.addViewController("/").setViewName("pages/index");
        registry.addViewController("/login").setViewName("pages/login");
        registry.addViewController("/find").setViewName("pages/find");
        registry.addViewController("/register").setViewName("pages/register");
        registry.addViewController("/files").setViewName("pages/files/files");
        registry.addViewController("/settings").setViewName("pages/settings/profile");
        registry.addViewController("/settings/edit").setViewName("pages/settings/edit");

        registry.addViewController("/main").setViewName("pages/dashboard/dash-board"); // /main -> dashBoard.html
        
        //registry.addViewController("/").setViewName("index"); // / -> index.html
        registry.addViewController("/samples").setViewName("pages/dash-board"); // / -> index.html
        registry.addViewController("/samples/main").setViewName("pages/dash-board"); // /main -> dashBoard.html
        registry.addViewController("/samples/memo-templates").setViewName("pages/system/memo-templates"); // /companies -> companies.html
        registry.addViewController("/samples/companies").setViewName("pages/system/companies"); // /companies -> companies.html
        //SamplePages
        registry.addViewController("/samples/buttons").setViewName("samples/buttons"); // /samples/buttons -> buttons.html
        registry.addViewController("/samples/cards").setViewName("samples/cards"); // /samples/cards -> cards.html
        registry.addViewController("/samples/utilities-color").setViewName("samples/utilities-color"); // /samples/utilities-color -> utilities-color.html
        registry.addViewController("/samples/utilities-border").setViewName("samples/utilities-border"); // /samples/utilities-border -> utilities-border.html
        registry.addViewController("/samples/utilities-animation").setViewName("samples/utilities-animation"); // /samples/utilities-animation -> utilities-animation.html
        registry.addViewController("/samples/utilities-other").setViewName("samples/utilities-other"); // /samples/utilities-other -> utilities-other.html
        registry.addViewController("/samples/login").setViewName("samples/login"); // /samples/login -> login.html
        registry.addViewController("/samples/register").setViewName("samples/register"); // /samples/register -> register.html
        registry.addViewController("/samples/forgot-password").setViewName("samples/forgot-password"); // /samples/forgot-password -> forgot-password.html
        registry.addViewController("/samples/404").setViewName("samples/404"); // /samples/404 -> 404.html
        registry.addViewController("/samples/charts").setViewName("samples/charts"); // /samples/charts -> charts.html
        registry.addViewController("/samples/tables").setViewName("samples/tables"); // /samples/tables -> tables.html
        registry.addViewController("/samples/blank").setViewName("samples/blank"); // /samples/tables -> tables.html

    }
    
}
