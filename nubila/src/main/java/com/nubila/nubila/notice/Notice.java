package com.nubila.nubila.notice;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

//@Getter
//@Setter
//@RequiredArgsConstructor
//@AllArgsConstructor
//@NoArgsConstructor
//public class Notice {
//	private Long id;
//	@NonNull private String title;
//	@NonNull private String content;
//	@NonNull private String status;
//	private Timestamp createDate;
//	private Timestamp modifyDate;
//}

public class Notice {
	private Long id;
	private String title;
	private String content;
	private String status;
	private Timestamp createDate;
	private Timestamp modifyDate;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Timestamp getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Timestamp createDate) {
		this.createDate = createDate;
	}
	public Timestamp getModifyDate() {
		return modifyDate;
	}
	public void setModifyDate(Timestamp modifyDate) {
		this.modifyDate = modifyDate;
	}
	
	@Override
	public String toString() {
		return "Notice [id=" + id + ", title=" + title + ", content=" + content + ", status=" + status + ", createDate="
				+ createDate + ", modifyDate=" + modifyDate + "]";
	}	
	
}
