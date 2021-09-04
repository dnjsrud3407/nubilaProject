package com.nubila.nubila.config;

import com.nubila.nubila.handler.UserLoginSuccessHandler;
import com.nubila.nubila.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserService userService;

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers( "/", "/resources/**", "/css/**", "/js/**", "/img/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf()
                .ignoringAntMatchers("/user/logout")
                .and()
                .authorizeRequests()
                    // 페이지 권한 설정
                    // 1. 모두에게 Open되는 곳
                    .antMatchers(urlPermitAll())
                        .permitAll()
                    // 2. 특정 권한에게 Open되는 곳
                    .antMatchers(urlPermitUser()).hasRole("USER")
                    .antMatchers("/admin").hasRole("ADMIN")
                    // 3. 그 밖의 페이지는 모두 로그인 필요
                    .anyRequest()
                        .authenticated()
                .and()
                // 로그인 설정
                .formLogin()
                    .loginPage("/user/login")
                    .usernameParameter("user_login_id")
                    .defaultSuccessUrl("/nubila")
                    .successHandler(new UserLoginSuccessHandler())
                    //.failureUrl("/user/login?error=true")
                    //.failureHandler(new UserLoginFailHandler())
                .and()
                .logout()
                    .logoutUrl("/user/logout")
                    .logoutSuccessUrl("/")
                    .invalidateHttpSession(true);
                //.and()
                // 403 예외처리 핸들링
                //.exceptionHandling().accessDeniedPage("/user/denied");
    }

    public String[] urlPermitAll() {
        String[] urls = new String[] {
                "/", "/nubila", "/support", "/search",
                "/user/login", "/user/join", "/user/idCheck", "/user/emailCheck", "/user/idSearchForm",
                "/user/idSearchResult", "/user/pwSearchForm", "/user/sendMail", "/user/pwChangeForm",
        };
        return urls;
    }

    public String[] urlPermitUser() {
        String[] urls = new String[] {
                "/bookmark/**",
                "/user/myInfo", "/user/pwConfirm", "/user/myInfoPwChange", "/user/myInfoPwChangeForm",
                "/user/emailConfirm", "/user/myInfoEmailChange", "/user/myInfoEmailChangeForm",
                "/user/delete", "/user/pwConfirmAndDelete", "/user/deleteOk"
        };
        return urls;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}