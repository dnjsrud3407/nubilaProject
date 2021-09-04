package com.nubila.nubila.inquery;

import java.util.List;

public interface InqueryService {
	public List<Inquery> getInqueryList();
	public List<Inquery> getInqueryListById(Long id);
	public Inquery getInquery(Long id);
	public boolean writeInquery(Inquery inquery, Long userId);
	public boolean removeInquery(Long id);
}
