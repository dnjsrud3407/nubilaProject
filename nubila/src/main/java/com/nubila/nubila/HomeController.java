package com.nubila.nubila;

import com.nubila.nubila.user.SecurityUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "redirect:/nubila";
    }

    @GetMapping("/nubila")
    public String nubila() {
        return "nubila";
    }

}
