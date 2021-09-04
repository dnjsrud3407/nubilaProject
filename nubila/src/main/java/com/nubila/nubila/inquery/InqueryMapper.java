package com.nubila.nubila.inquery;

import java.util.List;

import org.apache.ibatis.annotations.*;

@Mapper
public interface InqueryMapper {
	@Select("SELECT id, title, create_date FROM inquery WHERE status='normal' ORDER BY create_date DESC")
	List<Inquery> selectAllInquery();
	
	@Select("SELECT i.id, i.title, i.status, i.create_date FROM inquery AS i INNER JOIN user_inquery AS u ON i.id=u.inquery_id WHERE u.user_id=#{id} ORDER BY i.create_date DESC")
	List<Inquery> selectInqueryById(@Param("id")Long id);
	
	@Select("SELECT id, title, content, status, create_date, modify_date FROM inquery WHERE id = #{id}")
	Inquery selectInquery(@Param("id")Long id);
	
	@Insert("INSERT INTO inquery(title, content, status) VALUES(#{inquery.title}, #{inquery.content}, #{inquery.status})")
	@Options(useGeneratedKeys = true, keyProperty = "id")
	int insertInquery(@Param("inquery") Inquery inquery);
	
	@Insert("INSERT INTO user_inquery(user_id, inquery_id) VALUES(#{userId}, #{inqueryId})")
	int insertUserInquery(@Param("userId") Long userId, @Param("inqueryId") Long inqueryId);
	
	@Update("UPDATE inquery SET title=#{inquery.title}, content=#{inquery.content}, status=#{inquery.status} WHERE id=#{id}")
	int updateInquery(@Param("inquery") Inquery inquery);
	
	@Delete("DELETE FROM inquery WHERE id = #{id}")
	int deleteInquery(@Param("id") Long id);
	
	@Delete("DELETE FROM user_inquery WHERE inquery_id = #{id}")
	int deleteUserInquery(@Param("id") Long id);

}
