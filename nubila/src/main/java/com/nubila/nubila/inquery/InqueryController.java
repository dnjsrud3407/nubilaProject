package com.nubila.nubila.inquery;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.nubila.nubila.user.User;
import com.nubila.nubila.user.UserService;

@Controller
public class InqueryController {
	@Autowired
	InqueryServiceImpl inqueryServiceImpl;
	
	@Autowired
	UserService userService;
	
	@GetMapping("/support")
	public String getView() {
		return "support";
	}
	
	@GetMapping("/inquery")
	@ResponseBody
	public Map<String, Object> getList() {
		List<Inquery> inqueryList = inqueryServiceImpl.getInqueryList();
		Map<String, Object> map = new HashMap<>();
		map.put("list", inqueryList);
		return map;
	}
	
	@GetMapping("/myinquery")
	@ResponseBody
	public Map<String, Object> getMyInquery(Authentication authentication){
		Object principal = authentication.getPrincipal();
		Map<String, Object> map = new HashMap<>();
        if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            User user = userService.findOneUserByLoginId(user_login_id).get();
            List<Inquery> list = inqueryServiceImpl.getInqueryListById(user.getId());
    		map.put("list", list);
        }
		return map;		
	}
	
	@GetMapping("/inquerydetail/{id}")
	@ResponseBody
	public Map<String, Object> getInquery(@PathVariable(name="id") Long id) {
		Inquery inquery = inqueryServiceImpl.getInquery(id);
		Map<String, Object> map = new HashMap<>();
		map.put("content", inquery);
		return map;
	}
	
	@PostMapping("/inquery")
	@ResponseBody
	public void write(@RequestBody Inquery inquery, Authentication authentication) {
		Object principal = authentication.getPrincipal();
		if (principal instanceof UserDetails) {
            String user_login_id = ((UserDetails) principal).getUsername();
            User user = userService.findOneUserByLoginId(user_login_id).get();
            inqueryServiceImpl.writeInquery(inquery, user.getId());
		}
	}
	
	@DeleteMapping("inquery/{id}")
	@ResponseBody
	public void remove (@PathVariable(name="id") Long id) {
		inqueryServiceImpl.removeInquery(id);
	}
	
}
