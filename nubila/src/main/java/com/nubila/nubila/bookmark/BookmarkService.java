package com.nubila.nubila.bookmark;

import com.nubila.nubila.utils.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    @Autowired
    public BookmarkService (BookmarkRepository bookmarkRepository){
        this.bookmarkRepository = bookmarkRepository;
    }

    public List<BookmarkStationDto> getBookmarkStationAll(Integer start, Long userId){
        Status status = Status.NORMAL;
        return bookmarkRepository.selectBookmarkStationAll(start, userId, status);
    }

    public Long addBookmarkStation(BookmarkStationDto bookmarkStationDto) {
        bookmarkRepository.insertBookmarkStation(bookmarkStationDto);
        Long id = bookmarkStationDto.getId();
        return id;
    }

    public boolean editBookmarkStationStatusToDeleted(BookmarkStationDto bookmarkStationDto) {
        return bookmarkRepository.updateBookmarkStationStatus(bookmarkStationDto);
    }


//   북마크 루트
    public List<BookmarkRouteDto> getBookmarkRouteAll(Integer start, Long userId) {
        Status status = Status.NORMAL;
        return bookmarkRepository.selectBookmarkRouteAll(start, userId, status);
    }

    public Long addBookmarkRoute(BookmarkRouteDto bookmarkRouteDto) {
        bookmarkRepository.insertBookmarkRoute(bookmarkRouteDto);
        Long id = bookmarkRouteDto.getId();
        return id;
    }

    public boolean editBookmarkRouteStatusToDeleted(BookmarkRouteDto bookmarkRouteDto) {
        return bookmarkRepository.updateBookmarkRouteStatus(bookmarkRouteDto);
    }


}
