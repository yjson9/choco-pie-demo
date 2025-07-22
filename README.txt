## 프로젝트 설정

1. **VSCode필수 확장프로그램**
   - Extension Pack for Java 
   - Spring Boot Extension Pack 

2. **Swagger UI 접속**
   - http://localhost:8080/swagger-ui/index.html

## 프로젝트 구조 설명
1. Front : spring-boot-starter-thymeleaf, thymeleaf-layout-dialect
   - 템플릿 : sb-admin2
   - config/WebConfig에서 초기호출 라우트
   - http://localhost:8080/pages/companies => 조회
   - resources/templates/layouts/layout.html : 기본 레이아웃 html

2. Back
   - controller/CompaniesApiController : RestApi
   - controller/CompaniesController : 타임리프 화면단 리턴
   - repository/**Repository : JPA
   - dao/**Mapper : mybatis
