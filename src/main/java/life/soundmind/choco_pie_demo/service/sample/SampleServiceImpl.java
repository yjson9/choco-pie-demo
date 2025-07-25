package life.soundmind.choco_pie_demo.service.sample;

import java.util.List;

import org.springframework.stereotype.Service;

import life.soundmind.choco_pie_demo.dao.sample.SampleMapper;
import life.soundmind.choco_pie_demo.model.sample.Sample;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SampleServiceImpl implements SampleService {

    private final SampleMapper sampleMapper;

    @Override
    public List<Sample> getSamples() {
        return sampleMapper.getSamples();
    }

}
