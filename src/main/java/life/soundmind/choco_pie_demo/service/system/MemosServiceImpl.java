package life.soundmind.choco_pie_demo.service.system;

import java.lang.reflect.Field;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import life.soundmind.choco_pie_demo.model.system.MemoInfos;
import life.soundmind.choco_pie_demo.model.system.MemoTemplates;
import life.soundmind.choco_pie_demo.repository.system.MemoTemplatesRepository;
import life.soundmind.choco_pie_demo.repository.system.MemosRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
/**
 * <pre>
 * <b>Description  : 메모 서비스</b>
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
@Slf4j
@Service
@RequiredArgsConstructor
public class MemosServiceImpl implements MemosService {

    /**
     * 메모 레포지토리
     */
    @Resource
    private MemosRepository repo;

    /**
     * 메모양식 레포지토리
     */
    @Resource
    private MemoTemplatesRepository tRepo;

    private static final Pattern PLACEHOLDER_PATTERN = Pattern.compile("#\\{(\\w+)}");

    /**
     * <PRE>
     * <b>메모 단건 조회</b>
     * </PRE>
     * method  : selectMemos
     *
     * @param id 인덱스 id
     */
    @Override
    public String selectMemoTexts(String storeId,String id) {

        if (log.isDebugEnabled()) {
            log.debug(":::: selectMemoTexts :::: String storeId    : {}, String id    : {}",storeId, id);
        }

        // 주문 데이터 조회
        MemoInfos memoInfo = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("주문 정보가 없습니다: id=" + id));

        // 템플릿 리스트 조회 (storeId, useYn = true, seq순 정렬)
        List<MemoTemplates> templates = tRepo.findByStoreIdAndUseYnTrueOrderBySeqAsc(storeId);
        
        StringBuilder sb = new StringBuilder();

        templates.forEach(template -> {
            String resolved = resolveExpression(memoInfo, template.getExpression());
            sb.append(template.getSeq()).append(". ")
              .append(template.getLabel()).append(" : ")
              .append(resolved).append("\n");
        });

        return sb.toString();
    }

    private String resolveExpression(Object obj, String expression) {
        Matcher matcher = PLACEHOLDER_PATTERN.matcher(expression);
        StringBuffer sb = new StringBuffer();

        while (matcher.find()) {
            String fieldName = matcher.group(1);
            String fieldValue = getFieldValueByName(obj, fieldName);
            matcher.appendReplacement(sb, Matcher.quoteReplacement(fieldValue));
        }
        matcher.appendTail(sb);

        return sb.toString();
    }

    private String getFieldValueByName(Object obj, String fieldName) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            Object value = field.get(obj);

            if (value == null) {
                return ""; // null이면 무조건 빈칸
            }
            if (value instanceof java.time.LocalDate) {
                return ((java.time.LocalDate) value).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            }
            
            return value.toString();
        } catch (NoSuchFieldException | IllegalAccessException e) {
            log.warn("필드 접근 오류: {} -> {}", fieldName, e.getMessage());
            return "";
        }
    }
}
