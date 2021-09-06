package com.nubila.nubila.answer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnswerController {
	@Autowired
	private AnswerServiceImpl answerServiceImpl;
	
	@GetMapping("/answer")
	public Map<String, Object> getList(){
		List<Answer> list = answerServiceImpl.getAnswerList();
		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		return map;
	}
	
	@GetMapping("/answer/{id}")
	public Map<String, Object> getListById(@PathVariable(name="id") Long id) {
		List<Answer> list = answerServiceImpl.getAnswerListById(id);
		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		return map;
	}
	
	@PostMapping("/answer")
	public void writeAnswer(@RequestBody Answer answer) {
		if (answer.getWriter() == null) {
			answer.setWriter("USER");
		}
		answerServiceImpl.writeAnswer(answer);		
	}
	
	@DeleteMapping("/answer/{id}")
	public void removeAnswer(@PathVariable(name="id") Long id) {
		answerServiceImpl.remove(id);
	}
}
