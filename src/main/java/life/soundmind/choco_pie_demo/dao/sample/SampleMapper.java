package life.soundmind.choco_pie_demo.dao.sample;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import life.soundmind.choco_pie_demo.model.sample.Sample;

@Mapper
public interface SampleMapper {

    List<Sample> getSamples();
}
