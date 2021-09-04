package com.nubila.nubila.user;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.support.RequestContextUtils;

import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import java.nio.charset.Charset;
import java.util.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private final UserService userService;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/join")
    public String joinForm(@ModelAttribute("user") User user) {
        return "user/join";
    }

    @PostMapping("/join")
    public String join(@ModelAttribute User user) {
        userService.save(user);
        return "redirect:/";
    }

    @PostMapping("/idCheck")
    @ResponseBody
    public int idCheck(@RequestParam String user_login_id) {
        log.info("user_login_id : {}", user_login_id);
        int cnt = 1;

        // DB를 조회한 후 중복되는 id가 없다면 cnt = 0
        if (!userService.findOneUserByLoginId(user_login_id).isPresent()) {
            cnt = 0;
        }
        return cnt;
    }

    @PostMapping("/emailCheck")
    @ResponseBody
    public int emailCheck(@RequestParam String email) {
        log.info("email : {}", email);
        int cnt = 1;

        // DB를 조회한 후 중복되는 email이 없다면 cnt = 0
        if (!userService.findOneUserByEmail(email).isPresent()) {
            cnt = 0;
        }
        log.info("cnt : {}", cnt);
        return cnt;
    }

    @GetMapping("/login")
    public String loginForm(HttpServletRequest request, Model model) {
        // login 페이지 이동 전 uri 정보를 저장하여
        // login 후 원래 페이지로 이동
        String uri = request.getHeader("Referer");

        if (uri != null && !uri.contains("/login") && !uri.contains("/idSearchResult") && !uri.contains("/idSearchForm") && !uri.contains("/pwChangeForm")) {
            System.out.println("before page : " + uri);
            request.getSession().setAttribute("prevPage",
                    request.getHeader("Referer"));
        }
        return "user/login";
    }

    @GetMapping("/idSearchForm")
    public String idSeachForm() {
        return "user/idSearchForm";
    }

    @PostMapping("/idSearchForm")
    public String idSeachPro(@ModelAttribute User user, RedirectAttributes redirectAttributes) {
        if (userService.findByName_Email(user).isPresent()) {
            String user_login_id = userService.findByName_Email(user).get();
            redirectAttributes.addFlashAttribute("user_login_id", user_login_id);
            return "redirect:/user/idSearchResult";
        } else {
            return "redirect:/user/idSearchForm?error";
        }
    }

    @GetMapping("/idSearchResult")
    public String idSearchResult(HttpServletRequest request, Model model) {
        Map<String, ?> flashMap = RequestContextUtils.getInputFlashMap(request);
        if (flashMap != null) {
            model.addAttribute("user_login_id", flashMap.get("user_login_id"));
        }
        return "user/idSearchResult";
    }

    @GetMapping("/pwSearchForm")
    public String pwSearchForm() {
        return "user/pwSearchForm";
    }

    @PostMapping("/sendMail")
    @ResponseBody
    public String sendMail(@RequestParam String user_login_id, @RequestParam String username, @RequestParam String email) {
        User user = new User();
        user.setUser_login_id(user_login_id);
        user.setUsername(username);
        user.setEmail(email);

        // user 있는지 확인
        if (userService.findPwByLoginId_Name_Email(user).isPresent()) {
            String randomString = RandomStringUtils.randomAlphanumeric(8);

            // 메일 보내기
            String setFrom = "nubila@nubila.com";
            String toMail = email;
            String title = "누비라| 비밀번호 인증 이메일 입니다.";
            String content =
                    "인증 번호는 " + randomString + " 입니다." +
                            "<br>" +
                            "해당 인증번호를 인증번호 확인란에 기입하여 주세요.";

            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
                helper.setFrom(setFrom);
                helper.setTo(toMail);
                helper.setSubject(title);
                helper.setText(content, true);
                mailSender.send(message);

            } catch (Exception e) {
                e.printStackTrace();
            }

            return randomString;
        } else {
            return null;
        }
    }

    @PostMapping("/pwSearchForm")
    public String pwSearchPro(@RequestParam String user_login_id, RedirectAttributes redirectAttributes) {
        // 비밀번호 update 를 위한 user_login_id 넘김
        redirectAttributes.addFlashAttribute("user_login_id", user_login_id);
        return "redirect:/user/pwChangeForm";
    }

    @GetMapping("/pwChangeForm")
    public String pwSearchConfirm(Model model) {
        return "user/pwChangeForm";
    }

    @PostMapping("/pwChangeForm")
    public String pwChangePro(@ModelAttribute User user) {
        userService.updatePassword(user);
        return "redirect:/user/login";
    }

    @GetMapping("/myInfo")
    public String update(Authentication authentication, Model model) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            User user = userService.findOneUserByLoginId(user_login_id).get();
            user.setUser_login_id(user_login_id);

            //  email 보호
            String secureEmail = user.getEmail();
            String[] strings = secureEmail.split("@");
            String secureId = "";

            for (int i = 0; i < strings[0].length(); i++) {
                if (i > 3) {
                    secureId += "*";
                } else {
                    secureId += strings[0].charAt(i);
                }
            }

            secureEmail = secureId + "@" + strings[1];
            model.addAttribute("secureEmail", secureEmail);
            model.addAttribute("user", user);
        }
        return "user/myInfo";
    }

    @PostMapping("/pwConfirm")
    @ResponseBody
    public int pwConfirm(Authentication authentication, @RequestParam String confirm_password) {
        int cnt = 1;

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String password = ((UserDetails) principal).getPassword();
            String encodedPassword = passwordEncoder.encode(confirm_password);
            if (passwordEncoder.matches(confirm_password, password)) {
                cnt = 0;
            }
        }
        return cnt;
    }

    @GetMapping("/myInfoPwChange")
    public String myInfoPwChange(Authentication authentication, RedirectAttributes redirectAttributes) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            redirectAttributes.addFlashAttribute("user_login_id", user_login_id);
        }
        return "redirect:/user/myInfoPwChangeForm";
    }

    @GetMapping("/myInfoPwChangeForm")
    public String myInfoPwChangeForm() {
        return "user/myInfoPwChangeForm";
    }

    @PostMapping("/myInfoPwChangeForm")
    public String myInfoPwChangePro(Authentication authentication, @ModelAttribute User user) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            user.setUser_login_id(user_login_id);
        }
        userService.updatePassword(user);
        return "redirect:/user/myInfo";
    }

    @PostMapping("/emailConfirm")
    @ResponseBody
    public int emailConfirm(Authentication authentication, @RequestParam String confirm_email) {
        int cnt = 1;

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            User user = userService.findOneUserByLoginId(user_login_id).get();
            if(user.getEmail().equals(confirm_email)) {
                cnt = 0;
            }
        }
        return cnt;
    }

    @GetMapping("/myInfoEmailChange")
    public String myInfoEmailChange(Authentication authentication, RedirectAttributes redirectAttributes) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            redirectAttributes.addFlashAttribute("user_login_id", user_login_id);
        }
        return "redirect:/user/myInfoEmailChangeForm";
    }

    @GetMapping("/myInfoEmailChangeForm")
    public String myInfoEmailChangeForm() {
        return "user/myInfoEmailChangeForm";
    }

    @PostMapping("/myInfoEmailChangeForm")
    public String myInfoEmailChangePro(Authentication authentication, @ModelAttribute User user) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            user.setUser_login_id(user_login_id);
        }
        userService.updateEmail(user);
        return "redirect:/user/myInfo";
    }

    @GetMapping("/delete")
    public String deleteInfo() {
        return "user/deleteInfo";
    }

    /**
     * 회원탈퇴 시 비밀번호 확인
     * @return
     */
    @GetMapping("/pwConfirm")
    public String pwConfirm() {
        return "user/pwConfirm";
    }

    @GetMapping("/pwConfirmAndDelete")
    public String pwConfirmAndDelete(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            userService.deleteUser(user_login_id);
        }

        return "redirect:/user/deleteOk";
    }

    @GetMapping("/deleteOk")
    public String deleteOk(HttpServletRequest request) {
        request.getSession().invalidate();
        return "user/deleteOk";
    }

    @GetMapping("/list")
    @ResponseBody
    public Map<String, Object> userlist() {
        List<User> userList = userService.getUser();
        Map<String, Object> map = new HashMap<>();
        map.put("list", userList);
        return map;
    }
}