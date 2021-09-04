package com.nubila.nubila.adminTest;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.nubila.nubila.notice.Notice;
import com.nubila.nubila.notice.NoticeServiceImpl;

public class NoticeServiceTest {
	
	@Autowired
	NoticeServiceImpl noticeServiceImpl;
	
	@Test
	public void getNotice() {
		final Notice notice = new Notice("공지", "공지사항입니다", "Normal");
		
		System.out.println(notice.getTitle());
		System.out.println(notice.getContent());
	}
	
	@Test
	public void getNoticeListTest() {
		List<Notice> noticeList = noticeServiceImpl.getNoticeList();
		for (Notice n : noticeList) {
			System.out.println(n);
		}
	}
}
