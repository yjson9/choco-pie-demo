package life.soundmind.choco_pie_demo.config;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import lombok.RequiredArgsConstructor;


import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@RequiredArgsConstructor
@Configuration
public class SwaggerConfig {

    @Value("${db.mode}")
    private String dbMode;
    

    @Bean
    public OpenAPI openAPI(@Value("${springdoc.version}") String springdocVersion) {
        Info info = new Info()
                .title("CHOCO-PIE API")
                .version(springdocVersion)
                .description("초코파이 API (" + dbMode + ")");

        // SecurityScheme securityScheme = new SecurityScheme()
        //         .type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")
        //         .in(SecurityScheme.In.HEADER).name(JwtProperties.HEADER_STRING);
        // SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");

        // return new OpenAPI()
        //         .components(new Components().addSecuritySchemes("bearerAuth", securityScheme))
        //         .security(Arrays.asList(securityRequirement))
        //         .info(info);        
        return new OpenAPI()
                .info(info);
    }




    @Bean
    public GroupedOpenApi chatOpenApi() {
        String[] paths = {"/**"};

        return GroupedOpenApi.builder()
                .group("Choco Pie System API")
                .pathsToMatch(paths)
                .build();
    }

    // 사용자 API 문서화 설정 (그룹화)
    // @Bean
    // public GroupedOpenApi userApi() {
    //     return GroupedOpenApi.builder()
    //             .group("user-api")
    //             .pathsToMatch("/user/**")  // /user/** 경로에 해당하는 API만 그룹화
    //             .build();
    // }

    // // 관리자 API 문서화 설정 (그룹화)
    // @Bean
    // public GroupedOpenApi adminApi() {
    //     return GroupedOpenApi.builder()
    //             .group("admin-api")
    //             .pathsToMatch("/admin/**")  // /admin/** 경로에 해당하는 API만 그룹화
    //             .build();
    // }

}
