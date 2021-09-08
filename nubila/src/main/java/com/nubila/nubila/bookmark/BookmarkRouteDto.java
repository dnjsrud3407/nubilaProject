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
}
