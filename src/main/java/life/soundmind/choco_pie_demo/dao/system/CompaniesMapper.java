package life.soundmind.choco_pie_demo.dao.system;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import life.soundmind.choco_pie_demo.model.system.Companies;
import life.soundmind.choco_pie_demo.model.system.CompaniesParams;
import life.soundmind.choco_pie_demo.model.system.CompaniesRegistParams;

/**
 * <pre>
 * <b>Description  : 업체 맵퍼 인터페이스</b>
 * <b>Project Name : choco-pie-demo</b>
 * package  : life.soundmind.choco_pie_demo.dao
 * </pre>
 *
 * @author : yjson
 * @version : 1.0
 * @since <pre>
 * Modification Information
 *    수정일              수정자                수정내용
 * ---------------   ---------------   ----------------------------
 *  2025.07. 21.        yjson           최초생성
 * </pre>
 */
@Mapper
public interface CompaniesMapper {

    /**
     * <PRE>
     * <b>업체목록 </b>
     * </PRE>
     * method  : selectCompaniesList
     *
     * @return List<Companies> 업체목록
     */

     List<Companies> selectCompaniesList(CompaniesParams params);

     /**
      * <PRE>
     * <b>업체 단건 조회</b>
      * </PRE>
      * method  : selectCompanies
      *
      * @return Companies 업체정보
      */
 
      Companies selectCompanies(String id);

     /**
      * <PRE>
      * <b>업체 정보 저장</b>
      * </PRE>
      * method  : selectCompanies
      *
      * @return Companies 업체정보
      */
 
      int registCompanies(CompaniesRegistParams params);

}
