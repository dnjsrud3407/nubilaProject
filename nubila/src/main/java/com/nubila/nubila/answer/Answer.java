package com.nubila.nubila.answer;

import java.sql.Timestamp;

public class Answer {
	private Long id;
	private Long inqueryId;
	private String content;
	private String writer;
	private String status;
	private Timestamp createDate;
	private Timestamp modifyDate;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getInqueryId() {
		return inqueryId;
	}
	public void setInqueryId(Long inqueryId) {
		this.inqueryId = inqueryId;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getWriter() {
		return writer;
	}
	public void setWriter(String writer) {
		this.writer = writer;
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
		return "Answer [id=" + id + ", inqueryId=" + inqueryId + ", content=" + content + ", writer=" + writer + ", createDate=" + createDate
				+ ", modifyDate=" + modifyDate + "]";
	}	
}
