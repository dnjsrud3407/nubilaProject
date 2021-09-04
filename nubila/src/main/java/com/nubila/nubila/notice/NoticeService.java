package com.nubila.nubila.notice;

import java.util.List;

public interface NoticeService {
	public List<Notice> getNoticeList();
	public Notice getNotice(Long id);
	public boolean writeNotice(Notice notice);
	public boolean removeNotice(Long id);
}
