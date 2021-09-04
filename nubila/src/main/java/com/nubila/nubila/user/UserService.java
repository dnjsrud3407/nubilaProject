package com.nubila.nubila.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 회원가입 : 패스워드 암호화, role = USER, enabled = true 로 설정
     * @param user
     * @return
     */
    public void save(User user) {
        // 패스워드 암호화
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        // 회원가입하는 경우 role = USER 변경
        user.setRole(String.valueOf(Role.ROLE_USER));

        // enabled = true 로 설정
        user.setEnabled(true);
        userMapper.save(user);
    }

    /**
     * 아이디로 User 찾기 (탈퇴한 유저 O)
     * - 회원가입시 아이디 중복체크 시 사용하는 메서드
     * @param user_login_id
     * @return Optional<User>
     */
    public Optional<User> findOneUserByLoginId(String user_login_id) {
        return userMapper.findOneUserByLoginId(user_login_id).stream().findAny();
    }

    /**
     * 이메일로 User 찾기
     * @param email
     * @return Optional<User>
     */
    public Optional<User> findOneUserByEmail(String email) {
        return userMapper.findOneUserByEmail(email).stream().findAny();
    }

    /**
     * 이메일로 비밀번호 찾기
     * @param email
     * @return
     */
    public Optional<User> findPasswordByEmail(String email) {
        return userMapper.findPasswordByEmail(email);
    }

    /**
     * 로그인 시 사용하는 메서드
     * @param user_login_id
     * @return User
     * @throws UsernameNotFoundException
     */
    @Override
    public UserDetails loadUserByUsername(String user_login_id) throws UsernameNotFoundException {
        SecurityUser user = userMapper.findEnabledUser_ByLoginId(user_login_id)
                .orElseThrow(() -> new UsernameNotFoundException("not found loginId : " + user_login_id));

        user.setUsername(user_login_id);
        return user;
    }

    /**
     * 아이디 찾기
     * @param user
     * @return User
     */
    public Optional<String> findByName_Email(User user) {
        return userMapper.findLoginIdByName_Email(user).stream().findAny();
    }

    /**
     * 비밀번호 찾기
     * @param user
     * @return User
     */
    public Optional<String> findPwByLoginId_Name_Email(User user) {
        return userMapper.findPwByLoginId_Name_Email(user).stream().findAny();
    }

    /**
     * 비밀번호 수정
     * @param user
     */
    public void updatePassword(User user) {
        // 패스워드 암호화
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        userMapper.updatePassword(user);
    }

    /**
     * 이메일 수정
     * @param user
     * @return
     */
    public void updateEmail(User user) {
        userMapper.updateEmail(user);
    }

    /**
     * 회원 탈퇴
     * @param user_login_id
     * @return 1보다 크면 탈퇴 성공
     */
    public void deleteUser(String user_login_id) {
        userMapper.deleteUser(user_login_id);
    }


    public List<User> getUser() {
        return userMapper.getUser();
    }
}
