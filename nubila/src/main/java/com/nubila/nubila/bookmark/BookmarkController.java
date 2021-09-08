package com.nubila.nubila.bookmark;

import com.nubila.nubila.user.SecurityUser;
import com.nubila.nubila.utils.Status;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping(path = "bookmark")
public class BookmarkController {
    BookmarkService bookmarkService;
    @Autowired
    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping
    public String returnBookmarkHtml() {
        return "bookmark"; // 리턴값이 없어도 기본 매핑 주소에 맞게 view 파일을 찾아간다.
    }

    @GetMapping("station")
    @ResponseBody
    public Map<String, Object> stationBookmarkList(Authentication authentication,
                                                   @RequestParam(name="start", required = false, defaultValue = "0") int start) {
        Map<String, Object> map = new HashMap<>();
        SecurityUser customUserDetails = (SecurityUser)authentication.getPrincipal();
        Long userId = customUserDetails.getId();

        List<BookmarkStationDto> list = bookmarkService.getBookmarkStationAll(start, userId);
        map.put("stations", list);
        return map;
    }

    @PostMapping("station")
    @ResponseBody
    public Map<String, Object> addBookmarkStation(Authentication authentication,
                                                  @RequestBody BookmarkStationDto bookmarkStationDto) {

        Map<String, Object> map = new HashMap<>();
        SecurityUser customUserDetails = (SecurityUser)authentication.getPrincipal();
        long userId = customUserDetails.getId();
        bookmarkStationDto.setUserId(userId);
        bookmarkStationDto.setStatus(Status.NORMAL);

        //TODO id 값이 없을 경우?
        long id = bookmarkService.addBookmarkStation(bookmarkStationDto);
        map.put("resultId", id);
        return map;
    }

    @PutMapping("station")
    @ResponseBody
    public Map<String, Object> editBookmarkStation(Authentication authentication,
                                                   @RequestBody BookmarkStationDto bookmarkStationDto) {

        Map<String, Object> map = new HashMap<>();
        SecurityUser customUserDetails = (SecurityUser)authentication.getPrincipal();
        long userId = customUserDetails.getId();
        bookmarkStationDto.setUserId(userId);
        bookmarkStationDto.setStatus(Status.DELETED);

        boolean check = bookmarkService.editBookmarkStationStatusToDeleted(bookmarkStationDto);
        map.put("result", check);
        return map;
    }

    @GetMapping("route")
    @ResponseBody
    public Map<String, Object> routeBookmarkList(Authentication authentication,
                                                 @RequestParam(name="start", required = false, defaultValue = "0") int start) {

        Map<String, Object> map = new HashMap<>();
        SecurityUser customUserDetails = (SecurityUser) authentication.getPrincipal();
        long userId = customUserDetails.getId();
        List<BookmarkRouteDto> list = bookmarkService.getBookmarkRouteAll(start, userId);
        map.put("routes", list);

        return map;
    }

    @PostMapping("route")
    @ResponseBody
    public Map<String, Object> editBookmarkRoute(Authentication authentication,
                                                 @RequestBody BookmarkRouteDto bookmarkRouteDto) {
        Map<String, Object> map = new HashMap<>();
        SecurityUser customUserDetails = (SecurityUser) authentication.getPrincipal();
        long userId = customUserDetails.getId();
        bookmarkRouteDto.setUserId(userId);
        bookmarkRouteDto.setStatus(Status.NORMAL);

        Long id = bookmarkService.addBookmarkRoute(bookmarkRouteDto);
        map.put("resultId", id);
        return map;
    }

    @PutMapping("route")
    @ResponseBody
    public Map<String, Object> editBookmarkRoute(Authentication authentication,
                                                 @RequestBody Map<String, Object> reqMap) {

        Map<String, Object> map = new HashMap<>();
        SecurityUser customUserDetails = (SecurityUser) authentication.getPrincipal();
        long userId = customUserDetails.getId();
        String departureName = (String) reqMap.get("departureName");
        String destinationName = (String) reqMap.get("destinationName");
        BookmarkRouteDto bookmarkRouteDto = BookmarkRouteDto.builder()
                .userId(userId)
                .departureName(departureName)
                .destinationName(destinationName)
                .status(Status.DELETED)
                .modifyDate(LocalDateTime.now())
                .build();
        boolean check = bookmarkService.editBookmarkRouteStatusToDeleted(bookmarkRouteDto);
        map.put("result", check);
        return map;
    }

}
