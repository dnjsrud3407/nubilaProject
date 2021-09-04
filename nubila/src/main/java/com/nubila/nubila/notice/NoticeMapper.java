package com.nubila.nubila.notice;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface NoticeMapper {

	@Select("SELECT id, title, status, create_date FROM notice WHERE status = 'Normal' ORDER BY create_date DESC")
	List<Notice> selectAllNotice();
	
	@Select("SELECT id, title, content, status, create_date, modify_date FROM notice WHERE id = #{id}")
	Notice selectNotice(@Param("id") Long id);
	
	@Insert("INSERT INTO notice (title, content, status) VALUES (#{notice.title}, #{notice.content}, #{notice.status})")
	@Options(useGeneratedKeys = true, keyProperty = "id")
	int insertNotice(@Param("notice") final Notice notice);
	
	@Update("UPDATE notice SET title=#{notice.title}, content=#{notice.content}, status=#{notice.status}, modify_date=#{notice.modifyDate} WHERE id=#{notice.id}")
	int updateNotice(@Param("notice") Notice notice);
	
	@Delete("DELETE FROM notice WHERE id = #{id}")
	int deleteNotice(@Param("id") Long id);
}
