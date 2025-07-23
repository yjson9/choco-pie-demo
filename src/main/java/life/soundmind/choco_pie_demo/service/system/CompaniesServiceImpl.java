package life.soundmind.choco_pie_demo.service.system;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import life.soundmind.choco_pie_demo.common.exception.BusinessException;
import life.soundmind.choco_pie_demo.common.exception.ErrorCode;
import life.soundmind.choco_pie_demo.dao.system.CompaniesMapper;
import life.soundmind.choco_pie_demo.model.common.ResultModel;
import life.soundmind.choco_pie_demo.model.system.Companies;
import life.soundmind.choco_pie_demo.model.system.CompaniesParams;
import life.soundmind.choco_pie_demo.model.system.CompaniesRegistParams;
import life.soundmind.choco_pie_demo.repository.system.CompaniesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 * <b>Description  : 업체 서비스</b>
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
public class CompaniesServiceImpl implements CompaniesService {

    /**
     * 업체 맵퍼
     */
    @Resource
    private CompaniesMapper mapper;

    /**
     * 업체 레포지토리
     */
    @Resource
    private CompaniesRepository repo;

    /**
     * <PRE>
     * <b>업체목록 </b>
     * </PRE>
     * method  : selectUsersList
     *
     * @param params List<Companies> 업체목록
     */
    @Override
    public List<Companies> selectCompaniesList(CompaniesParams params) {

        if (log.isDebugEnabled()) {
            log.debug(":::: selectCompaniesList :::: selectCompaniesParams    : {} {} {}", params.getName());
        }

        return this.mapper.selectCompaniesList(params);

    }


    /**
     * <PRE>
     * <b>업체 단건 조회</b>
     * </PRE>
     * method  : selectCompanies
     *
     * @param id 인덱스 id
     */
    @Override
    public Companies selectCompanies(String id) {

        if (log.isDebugEnabled()) {
            log.debug(":::: selectCompanies :::: selectCompanies id    : {}", id);
        }

        return this.mapper.selectCompanies(id);
    }
    
    /**
     * <PRE>
     * <b>업체 목록 조회(JAP)</b>
     * </PRE>
     * <p>
     * method : selectAllCompaniesList
     *
     * @return List<Companies> 업체 목록
     */
    @Override
    public List<Companies> selectAllCompaniesList() {
        return this.repo.findAll();
    }
    

    /**
     * <PRE>
     * <b>업체목록을 등록한다.</b>
     * </PRE>
     * method  : insertCodeGroup
     *
     * @param params 코드그룹 등록 정보
     * @return ResultModel 처리결과
     */
    @Override
    @Transactional
    public ResultModel registCompanies(List<CompaniesRegistParams> paramsList) {

        if (log.isDebugEnabled()) {
            log.debug(":::: registCompanies :::: List<CompaniesRegistParams> paramsList : {}", paramsList.toString());
        }

        String name = "업체 저장";
        int cnt = 0;
        int err = 0;
        String msg;

        for (CompaniesRegistParams params : paramsList) {
            int result = this.mapper.registCompanies(params);
            cnt += (result >= 1 ? 1 : 0);
            //cnt += this.mapper.registCompanies(params); 
        }

        if (cnt == 0) {
            throw new BusinessException(ErrorCode.NOT_EXISTS_DATA); // "오류 "
        }

        msg = ResultModel.SUCCESS;

        return new ResultModel(name, cnt, err, msg);
    }
}
