package com.nubila.nubila.answer;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface AnswerMapper {
	@Select("SELECT id, inquery_id, writer, create_date FROM answer WHERE status = 'normal'")
	List<Answer> selectAllAnswer();
	
	@Select("SELECT id, inquery_id, content, writer, create_date, modify_date FROM answer WHERE inquery_id = #{id} AND status = 'normal'")
	List<Answer> selectAnswerById(@Param("id") Long id);
	
	@Insert("INSERT INTO answer(inquery_id, content, writer, status) VALUES(#{answer.inqueryId}, #{answer.content}, #{answer.writer}, #{answer.status})")
	int insertAnswer(@Param("answer") Answer answer);
	
	@Update("UPDATE answer SET content=#{answer.content}, status=#{answer.status} WHERE id = #{answer.id}")
	int updateAnswer(@Param("answer") Answer answer);
	
	@Delete("DELETE FROM answer WHERE id = #{id}")
	int deleteAnswer(@Param("id") Long id);	
}
