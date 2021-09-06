package com.nubila.nubila;

import com.nubila.nubila.user.User;
import com.nubila.nubila.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/admin")
    public String getView() {
        return "admin";
    }

    @GetMapping("/userlist")
    @ResponseBody
    public Map<String, Object> userlist() {
        List<User> userList = userService.getUser();
        Map<String, Object> map = new HashMap<>();
        map.put("list", userList);
        return map;
    }
}
