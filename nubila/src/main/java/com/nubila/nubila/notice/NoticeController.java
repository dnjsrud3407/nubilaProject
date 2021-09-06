package com.nubila.nubila.notice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
public class NoticeController {
	
	@Autowired
	private NoticeServiceImpl noticeServiceImpl;
	
	@GetMapping("/notice")
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
	public Map<String, Object> getNotice(@PathVariable(name="id") Long id){
		Notice notice = noticeServiceImpl.getNotice(id);
		Map<String, Object> map = new HashMap<>();
		map.put("content", notice);
		return map;
	}
	
	@PostMapping("/notice")
	public void write(@RequestBody Notice notice) {
//		System.out.println(notice);
		noticeServiceImpl.writeNotice(notice);
	}
	
	
	@DeleteMapping("/notice/{id}")
	public void remove(@PathVariable(name="id") Long id) {
		noticeServiceImpl.removeNotice(id);
	}
}
