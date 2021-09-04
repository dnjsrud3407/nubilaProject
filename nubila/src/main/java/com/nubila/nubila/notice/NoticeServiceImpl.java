package com.nubila.nubila.notice;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NoticeServiceImpl implements NoticeService{
	@Autowired
	NoticeMapper noticeMapper;
	
	@Override
	public List<Notice> getNoticeList() {
		List<Notice> list = noticeMapper.selectAllNotice();
		return list;
	}

	@Override
	public Notice getNotice(Long id) {
		Notice notice = noticeMapper.selectNotice(id);
		return notice;
	}
	
	@Override
	public boolean writeNotice(Notice notice) {
		int result = 0;
		if(notice.getId() == null) {
			// id가 null이면 INSERT
			result = noticeMapper.insertNotice(notice);
		}else {
			// id가 존재한다면 UPDATE
			//modify_date 수정 필요!!!!!
			Date date = new Date();
			long time = date.getTime();
			Timestamp ts = new Timestamp(time);
			notice.setModifyDate(ts);
			
			result = noticeMapper.updateNotice(notice);
		}
		
		return (result == 1) ? true : false;
	}

	@Override
	public boolean removeNotice(Long id) {
		int result = 0;
		result = noticeMapper.deleteNotice(id);
		return (result == 1) ? true : false;
	}
}
