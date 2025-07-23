package life.soundmind.choco_pie_demo.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ErrorCode {

    /*  ********************************************************************  */
    /*                                                                        */
    /*  400 Bad Request                                                    	  */
    /*                                                                        */
    /*  ********************************************************************  */

    BAD_REQUEST(400, "COMMON-ERR-400", "요청 데이터가 잘못되었습니다."),
    DUPLE_INPUT_VALUE(400, "VALID-ERR-003", "[{field1}] 은/는 이미 등록된 {field2}입니다."),
    NOT_EXISTS(400, "COMMON-ERR-400", "해당 {field}가 존재하지 않습니다."),
    ALREADY_DELETED(400, "COMMON-ERR-400", "이미 삭제된 {field}입니다."),
    EMPTY_INPUT_VALUE(400, "VALID-ERR-002", "{field} 은/는 필수 입력 항목 입니다."),
    INVALID_INPUT_VALUE(400, "VALID-ERR-001", " Invalid Input Value"),
    NOT_EXISTS_DATA(400, "COMMON-ERR-400", "데이터가 존재하지 않습니다."),
    NOT_MATCH_PWD(400, "COMMON-ERR-400", "비밀번호가 일치하지 않습니다."),
    NOT_EXISTS_ID(400, "COMMON-ERR-400", "존재하지 않는 ID입니다."),

    NOT_EXISTS_ORDERSCSUPDATE(400, "CS-ERR-400", "OrderCS 업데이트된 항목이없습니다."),
    NOT_EXISTS_ORDERSDATA(400, "ORDERS-ERR-400", "NO DATA"),
    NOT_EXISTS_ORDERSPICKUPUPDATE(400, "ORDERS-ERR-400", "PickUp 업데이트된 항목이없습니다."),
    NOT_EXISTS_ORDERSRECEIVERUPDATE(400, "ORDERS-ERR-400", "Receiver 업데이트된 항목이없습니다."),
    NOT_EXISTS_ORDERSUPDATE(400, "ORDERS-ERR-400", "Orders 업데이트된 항목이없습니다."),
    NOT_EXISTS_ORDER_COMPPENSATION_DATA(400, "COMPPENSATION-ERR-400", "NO DATA"),
    NOT_EXISTS_ORDER_COMPPENSATION_EXCEPTION_ERROR(400, "COMPPENSATION-ERR-400", "COMPPENSATION EXCEPTION ERROR"),
    NOT_EXISTS_ORDER_COMPPENSATION_INSERT(400, "ORDERS-ERR-400", "OrdersCompensation 입력된된 항목이없습니다."),
    NOT_EXISTS_ORDER_COMPPENSATION_UPDATE(400, "COMPPENSATION-ERR-400", "OrdersCompensation 업데이트된 항목이없습니다."),
    NOT_EXISTS_ORDER_CS_DATA(400, "CS-ERR-400", "NO DATA"),
    NOT_EXISTS_ORDER_CS_EXCEPTION_ERROR(400, "CS-ERR-400", "CS EXCEPTION ERROR"),
    NOT_EXISTS_ORDER_CS_INSERT(400, "ORDERCS-ERR-400", "OrderCS 입력된 항목이없습니다."),

    NOT_EXISTS_EXPORT_EXCEL(400, "EXCEL-ERR-400", "EXPORT_EXCEL 엑셀 자료 조회정보가 없습니다."),
    EXCEL_ZERO_CNT(400, "EXCEL-ERR-400", "엑셀 다운로드 유효행이 존재하지 않습니다."),
    LIMIT_EXCEL_DOWNLOAD_MAX_ROW_CNT(400, "VALID-ERR-003", "엑셀 다운로드 최대행을 초과하였습니다.<br>다운로드 엑셀파일 Row 갯수 {field1}<br>다운로드 가능한 최대 Row 갯수 {field2}."),

    EXCEL_DOWNLOAD_FAIL(400, "EXCEL-ERR-400", "엑셀 다운로드 오류입니다."),

    /*  ********************************************************************  */
    /*                                                                        */
    /*  401 Unauthorized                                                   	  */
    /*                                                                        */
    /*  ********************************************************************  */
    HANDLE_ACCESS_DENIED(401, "AUTH-ERR-401", "권한이 없습니다."),
    ACCESS_DENIED_EXCEPTION(401, "COMMON-ERR-401", "권한이 없습니다."),
    JWT_UNAUTHORIZED(401, "JWT-ERR-01", "토큰 인증에 실패하였습니다."),
    JWT_TOKEN_EXPIRED_EXCEPTION(401, "JWT-ERR-02", "로그인 정보가 만료되었습니다."),
    JWT_VERIFICATION_EXCEPTION(401, "JWT-ERR-03", "유효하지 않은 인증정보입니다."), //토큰 유형이 이상함
    EXPIRED_JWT_EXCEPTION(401, "JWT-ERR-04", "토큰 인증에 실패하였습니다."),
    JWT_EXCEPTION(401, "JWT-ERR-05", "토큰 인증에 실패하였습니다."),
    /*  ********************************************************************  */
    /*                                                                        */
    /*  403 Forbidden                                                     	  */
    /*                                                                        */
    /*  ********************************************************************  */

    FORBIDDEN(403, "COMMON-ERR-403", "금지"),

    /*  ********************************************************************  */
    /*                                                                        */
    /*  404 Not Found                                                     	  */
    /*                                                                        */
    /*  ********************************************************************  */
    NOT_FOUND(404, "COMMON-ERR-404", "문서를 찾을 수 없습니다."),
    NOT_FOUND_HTTP(404, "COMMON-ERR-404", "요청경로가 잘못되었습니다."),

    /*  ********************************************************************  */
    /*                                                                        */
    /*  405 Method Not Allowed                                                */
    /*                                                                        */
    /*  ********************************************************************  */
    METHOD_NOT_ALLOWED(405, "COMMON-ERR-405", "허용되지 않은 메소드입니다."),


    /*  ********************************************************************  */
    /*                                                                        */
    /*  500                                                        	          */
    /*                                                                        */
    /*  ********************************************************************  */

    INTERNAL_SERVER_ERROR(500, "COMMON-ERR-500", "Server Error");

    // Member
    //    EMAIL_DUPLICATION(400, "M001", "Email is Duplication"),
    //    LOGIN_INPUT_INVALID(400, "M002", "Login input is invalid"),

    private final int status;
    private final String code;
    private final String message;

}
