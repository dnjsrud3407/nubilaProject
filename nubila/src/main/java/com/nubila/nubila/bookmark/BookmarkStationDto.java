package com.nubila.nubila.bookmark;

import com.nubila.nubila.utils.Status;
import lombok.*;

import java.time.LocalDateTime;

@Data
public class BookmarkStationDto {
	private long id;
    private long userId;
    private long stationId;
    private Status status; //Enum 생성 전
    private LocalDateTime createDate;
    private LocalDateTime modifyDate;

	public BookmarkStationDto() {
		createDate = LocalDateTime.now();
		modifyDate = LocalDateTime.now();
	}

    // eclipse에서 lombok이 제대로 적용되지 않아 추가
    public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public long getUserId() {
		return userId;
	}
	public void setUserId(long userId) {
		this.userId = userId;
	}
	public long getStationId() {
		return stationId;
	}
	public void setStationId(long stationId) {
		this.stationId = stationId;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public LocalDateTime getCreateDate() {
		return createDate;
	}
	public void setCreateDate(LocalDateTime createDate) {
		this.createDate = createDate;
	}
	public LocalDateTime getModifyDate() {
		return modifyDate;
	}
	public void setModifyDate(LocalDateTime modifyDate) {
		this.modifyDate = modifyDate;
	}

	@Override
	public String toString() {
		return "BookmarkStationDto{" +
				"id=" + id +
				", userId=" + userId +
				", stationId=" + stationId +
				", status='" + status + '\'' +
				", createDate=" + createDate +
				", modifyDate=" + modifyDate +
				'}';
	}
}
