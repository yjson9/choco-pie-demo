package life.soundmind.choco_pie_demo.repository.system;

import org.springframework.stereotype.Repository;

import life.soundmind.choco_pie_demo.model.system.MemoTemplates;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * <pre>
 * <b>Description  : 메모템플릿 레포지토리</b>
 * <b>Project Name : choco-pie-demo.</b>
 * package  : life.soundmind.choco_pie_demo.repository
 * </pre>
 *
 * @author : yjSon
 * @version : 1.0
 * @since <pre>
 * Modification Information
 *    수정일              수정자                수정내용
 * ---------------   ---------------   ----------------------------
 *  2025. 07. 22.        yjSon          최초생성
 * </pre>
 */
@Repository
public interface MemoTemplatesRepository extends JpaRepository<MemoTemplates, Integer> {

    List<MemoTemplates> findByStoreIdAndUseYnTrueOrderBySeqAsc(String storeId);

}
