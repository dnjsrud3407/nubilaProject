package com.nubila.nubila.bookmark;

import com.nubila.nubila.utils.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor @Builder
public class BookmarkRouteDto {
    private long id;
    private long userId;
    private String departureName;
    private double departureLon;
    private double departureLat;
    private String destinationName;
    private double destinationLon;
    private double destinationLat;
    private long departureStationId;
    private long destinationStationId;
    private Status status;
    private LocalDateTime createDate;
    private LocalDateTime modifyDate;

    public BookmarkRouteDto() {
        createDate = LocalDateTime.now();
        modifyDate = LocalDateTime.now();
    }

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

    public String getDepartureName() {
        return departureName;
    }

    public void setDepartureName(String departureName) {
        this.departureName = departureName;
    }

    public double getDepartureLon() {
        return departureLon;
    }

    public void setDepartureLon(double departureLon) {
        this.departureLon = departureLon;
    }

    public double getDepartureLat() {
        return departureLat;
    }

    public void setDepartureLat(double departureLat) {
        this.departureLat = departureLat;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public double getDestinationLon() {
        return destinationLon;
    }

    public void setDestinationLon(double destinationLon) {
        this.destinationLon = destinationLon;
    }

    public double getDestinationLat() {
        return destinationLat;
    }

    public void setDestinationLat(double destinationLat) {
        this.destinationLat = destinationLat;
    }

    public long getDepartureStationId() {
        return departureStationId;
    }

    public void setDepartureStationId(long departureStationId) {
        this.departureStationId = departureStationId;
    }

    public long getDestinationStationId() {
        return destinationStationId;
    }

    public void setDestinationStationId(long destinationStationId) {
        this.destinationStationId = destinationStationId;
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
        return "BookmarkRouteDto{" +
                "id=" + id +
                ", userId=" + userId +
                ", departureName='" + departureName + '\'' +
                ", departureLon=" + departureLon +
                ", departureLat=" + departureLat +
                ", destinationName='" + destinationName + '\'' +
                ", destinateionLon=" + destinationLon +
                ", destinateionLat=" + destinationLat +
                ", departureStationId=" + departureStationId +
                ", destinationStationId=" + destinationStationId +
                ", status='" + status + '\'' +
                ", createDate=" + createDate +
                ", modifyDate=" + modifyDate +
                '}';
    }
}
