package com.nubila.nubila.myInfo;

import com.nubila.nubila.user.User;
import com.nubila.nubila.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
@RequestMapping("/myInfo")
public class MyInfoController {
    @Autowired
    private final UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public String myInfo(Authentication authentication, Model model) {
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

    @GetMapping("/pwChange")
    public String myInfoPwChange(Authentication authentication, RedirectAttributes redirectAttributes) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            redirectAttributes.addFlashAttribute("user_login_id", user_login_id);
        }
        return "redirect:/myInfo/pwChangeForm";
    }

    @GetMapping("/pwChangeForm")
    public String myInfoPwChangeForm() {
        return "user/myInfoPwChangeForm";
    }

    @PostMapping("/pwChangeForm")
    public String myInfoPwChangePro(Authentication authentication, @ModelAttribute User user) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            user.setUser_login_id(user_login_id);
        }
        userService.updatePassword(user);
        return "redirect:/myInfo";
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

    @GetMapping("/emailChange")
    public String myInfoEmailChange(Authentication authentication, RedirectAttributes redirectAttributes) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            redirectAttributes.addFlashAttribute("user_login_id", user_login_id);
        }
        return "redirect:/myInfo/emailChangeForm";
    }

    @GetMapping("/emailChangeForm")
    public String myInfoEmailChangeForm() {
        return "user/myInfoEmailChangeForm";
    }

    @PostMapping("/emailChangeForm")
    public String myInfoEmailChangePro(Authentication authentication, @ModelAttribute User user) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            user.setUser_login_id(user_login_id);
        }
        userService.updateEmail(user);
        return "redirect:/myInfo";
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

}
