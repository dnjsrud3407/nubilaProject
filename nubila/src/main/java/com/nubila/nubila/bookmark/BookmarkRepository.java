package com.nubila.nubila.bookmark;

import com.nubila.nubila.utils.Status;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
public interface BookmarkRepository {

    /*
     * BookmarkStation
     */
    @Select("select id, user_id, station_id, status, create_date, modify_date from bookmark_station " +
            "where user_id = #{userId} and status = #{status}")
    List<BookmarkStationDto> selectBookmarkStationAll(@Param("start") int start, @Param("userId") long userId, @Param("status") Status status);

    @Insert("insert into bookmark_station(user_id, station_id, status, create_date, modify_date) " +
            "values (#{userId}, #{stationId}, #{status}, #{createDate}, #{modifyDate})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insertBookmarkStation(BookmarkStationDto bookmarkStationDto);

    @Update("update bookmark_station set status = #{status}, modify_date = #{modifyDate} " +
            "where user_id= #{userId} and station_id = #{stationId} and status = 'NORMAL'")
    boolean updateBookmarkStationStatus(BookmarkStationDto bookmarkStationDto);

    /*
    * BookmarkRoute
    */
    @Select("select id, user_id, departure_name, st_x(departure_lnglat) as departure_lon, st_y(departure_lnglat) as departure_lat, " +
            "destination_name, st_x(destination_lnglat) as destination_lon, st_y(destination_lnglat) as destination_lat, " +
            "departure_station_id, destination_station_id, status, create_date, modify_date from bookmark_route " +
            "where user_id = #{userId} and status = #{status}")
    List<BookmarkRouteDto> selectBookmarkRouteAll(int start, @Param("userId") long userId, Status status);

    @Insert("insert into bookmark_route(user_id, departure_name, departure_lnglat, destination_name, destination_lnglat, " +
            "departure_station_id, destination_station_id, status, create_date, modify_date) " +
            "values (#{userId}, #{departureName}, Point(#{departureLon}, #{departureLat}), " +
            "#{destinationName}, Point(#{destinationLon}, #{destinationLat}), " +
            "#{departureStationId}, #{destinationStationId}, #{status}, #{createDate}, #{modifyDate})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insertBookmarkRoute(BookmarkRouteDto bookmarkRouteDto);

    @Update("update bookmark_route set status = #{status}, modify_date = #{modifyDate} " +
            "where id = #{id} and status = 'NORMAL'")
    boolean updateBookmarkRouteStatus(BookmarkRouteDto bookmarkRouteDto);
}
