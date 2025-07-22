package life.soundmind.choco_pie_demo.service;

import java.util.List;

import life.soundmind.choco_pie_demo.model.Companies;
import life.soundmind.choco_pie_demo.model.CompaniesParams;
import life.soundmind.choco_pie_demo.model.CompaniesRegistParams;
import life.soundmind.choco_pie_demo.model.common.ResultModel;

/**
 * <pre>
 * <b>Description  : 업체 서비스 인터페이스</b>
 * <b>Project Name : choco-pie-demo</b>
 * package  : life.soundmind.choco_pie_demo.service
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


public interface CompaniesService {

    /**
     * <PRE>
     * <b>업체목록 </b>
     * </PRE>
     * method  : selectCompaniesList
     *
     * @param params 업체목록 검색 파라미터
     */

     List<Companies> selectCompaniesList(CompaniesParams params);

    /**
     * <PRE>
     * <b>업체 검색 결과단건</b>
     * </PRE>
     * method  : selectCompanies
     *
     * @param id 인덱스 id
     */
    Companies selectCompanies(String id);

	/**
	 *
	 * <PRE>
	 * <b>업체 리스트 전체를 조회한다.(JAP)</b>
	 * </PRE>
	 * method  : selectAllCompaniesList
	 * @param 
	 * @return  List<Companies> 업체 목록
	 */	
	public List<Companies> selectAllCompaniesList();
    
    /**
     * <PRE>
     * <b>업체목록을 저장한다.</b>
     * </PRE>
     * method  : registCmmnCode
     *
     * @param paramsList List<CmmnCodeRegistParams> 업체 등록 정보 목록
     * @return ResultModel 처리결과
     */
    ResultModel registCompanies(List<CompaniesRegistParams> paramsList);

}
