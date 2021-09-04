package com.nubila.nubila.answer;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnswerServiceImpl implements AnswerService {
	@Autowired
	AnswerMapper answerMapper;
	
	@Override
	public List<Answer> getAnswerList() {
		List<Answer> list = answerMapper.selectAllAnswer();
		return list;
	}

	@Override
	public List<Answer> getAnswerListById(Long id) {
		List<Answer> list = answerMapper.selectAnswerById(id);
		return list;
	}

	@Override
	public boolean writeAnswer(Answer answer) {
		int result = 0;
		if (answer.getId() == null) {
			result = answerMapper.insertAnswer(answer);
		} else {
			//modifyDate
			Date date = new Date();
			long time = date.getTime();
			Timestamp ts = new Timestamp(time);
			answer.setModifyDate(ts);
			
			result = answerMapper.updateAnswer(answer);
		}
		return (result == 1)? true : false;
	}

	@Override
	public boolean remove(Long id) {
		int result = 0;
		result = answerMapper.deleteAnswer(id);
		return (result == 1)? true : false;
	}

}
