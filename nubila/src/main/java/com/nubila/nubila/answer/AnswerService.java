package com.nubila.nubila.answer;

import java.util.List;

public interface AnswerService {
	public List<Answer> getAnswerList();
	public List<Answer> getAnswerListById(Long id);
	public boolean writeAnswer(Answer answer);
	public boolean remove(Long id);
}
