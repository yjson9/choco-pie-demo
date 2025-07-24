package life.soundmind.choco_pie_demo.service.system;

/**
 * <pre>
 * <b>Description  : 메모 서비스 인터페이스</b>
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


public interface MemosService {
	/**
	 *
	 * <PRE>
	 * <b>메모 리스트 전체를 조회한다.(JAP)</b>
	 * </PRE>
	 * method  : selectAllCompaniesList
	 * @param 
	 * @return  List<Companies> 메모 목록
	 */	
	String selectMemoTexts(String storeId,String id);

}
