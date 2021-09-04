package com.nubila.nubila.inquery;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InqueryServiceImpl implements InqueryService{
	@Autowired
	InqueryMapper inqueryMapper;
	
	@Override
	public List<Inquery> getInqueryList() {
		List<Inquery> list = inqueryMapper.selectAllInquery();
		return list;
	}

	@Override
	public List<Inquery> getInqueryListById(Long id) {
		List<Inquery> list = inqueryMapper.selectInqueryById(id);
		return list;
	}

	@Override
	public Inquery getInquery(Long id) {
		Inquery inquery = inqueryMapper.selectInquery(id);
		return inquery;
	}

	@Override
	public boolean writeInquery(Inquery inquery, Long userId) {
		int result = 0;
		if (inquery.getId() == null) {
			int cnt = inqueryMapper.insertInquery(inquery);
			result = inqueryMapper.insertUserInquery(userId, inquery.getId());
		}else {
			Date date = new Date();
			long time = date.getTime();
			Timestamp ts = new Timestamp(time);
			inquery.setModifyDate(ts);
			result = inqueryMapper.updateInquery(inquery);
		}
		return (result == 1)? true : false;
	}

	@Override
	public boolean removeInquery(Long id) {
		int result = 0;
		result = inqueryMapper.deleteInquery(id);
		inqueryMapper.deleteUserInquery(id);
		return (result == 1)? true : false;
	}

}
