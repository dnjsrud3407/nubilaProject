package com.nubila.nubila.notice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class NoticeController {
	
	@Autowired
	private NoticeServiceImpl noticeServiceImpl; 
	
	@GetMapping("/admin")
	public String getView() {
		return "admin";
	}
	
	@GetMapping("/notice")
	@ResponseBody
	public Map<String, Object> getList() {
		List<Notice> noticeList = noticeServiceImpl.getNoticeList();
		
		Map<String, Object> map = new HashMap<>();
//		if (noticeList.isEmpty()) {
//			
//		}
		map.put("list", noticeList);
		return map;
	}
	
	@GetMapping("/noticedetail/{id}")
	@ResponseBody
	public Map<String, Object> getNotice(@PathVariable(name="id") Long id){
		Notice notice = noticeServiceImpl.getNotice(id);
		Map<String, Object> map = new HashMap<>();
		map.put("content", notice);
		return map;
	}
	
	@PostMapping("/notice")
	@ResponseBody
	public void write(@RequestBody Notice notice) {
//		System.out.println(notice);
		noticeServiceImpl.writeNotice(notice);
	}
	
	
	@DeleteMapping("/notice/{id}")
	@ResponseBody
	public void remove(@PathVariable(name="id") Long id) {
		noticeServiceImpl.removeNotice(id);
	}
}
