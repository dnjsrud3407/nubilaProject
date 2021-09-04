package com.nubila.nubila.user;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {
    void save(User user);
    Optional<User> findOneUserByLoginId(String user_login_id);
    Optional<User> findOneUserByEmail(String email);
    Optional<SecurityUser> findEnabledUser_ByLoginId(String user_login_id);
    Optional<String> findLoginIdByName_Email(User user);
    Optional<String> findPwByLoginId_Name_Email(User user);
    Optional<User> findPasswordByEmail(String email);
    void updatePassword(User user);
    void updateEmail(User user);
    void deleteUser(String user_login_id);
    List<User> getUser();
}
