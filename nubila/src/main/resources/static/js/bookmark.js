'use strict';
const bookmarkStationList = document.querySelector("#bookmark-station-list");
const bookmarkRouteList = document.querySelector("#bookmark-route-list");
const tabMenu = document.querySelector(".tab-menu");

// 템플릿
const templatingHtml = {
    stationList : function (Element, terminalInfo) {
        Element.innerHTML +=
            `<li class="list-item" id="${terminalInfo.Vno}">
                <div>
                    <div>
                        ${terminalInfo.Tmname}
                    </div>
                    <div>
                        <span>빈 보관대 수 ${terminalInfo.Emptycnt}</span>
                        <span>주차된 자전거 수 ${terminalInfo.Parkcnt}</span>
                    </div>
                </div>
                <div class="btn-group">
                    <ul id="search-btn-group">
                            <li><a href="#">경유</a></li>
                            <li><a href="#">도착</a></li>
                    </ul>
                    <div id="bookmark-star" class="active"><i class="fas fa-star"></i></div>
                </div>
            </li>`;
    },
    routeList : function (Element, item, depTerminalInfo, desTerminalInfo) {
        Element.innerHTML +=
            `<li class="list-item" id="${item.id}">
                <div>
                    <div>
                         출발지 ${item.departureName} → 도착지 ${item.destinationName}
                    </div>
                    <div>
                        출발 터미널 ${depTerminalInfo.Tmname}
                    </div>
                    <div>
                        <span>빈 보관대 수 ${depTerminalInfo.Emptycnt}</span>
                        <span>주차된 자전거 수 ${depTerminalInfo.Parkcnt}</span>
                    </div>
                    <div>
                        도착 터미널 ${desTerminalInfo.Tmname}
                    </div>
                    <div>
                        <span>빈 보관대 수 ${desTerminalInfo.Emptycnt}</span>
                        <span>주차된 자전거 수 ${desTerminalInfo.Parkcnt}</span>
                    </div>
                </div>
                <div class="btn-group">
                    <div id="bookmark-star" class="active"><i class="fas fa-star"></i></div>
                </div>
            </li>`;
    }
}

// fetch with csrf token
let token = document.querySelector("meta[name='_csrf']").content;
function fetchData(url = '', method ='' ,data = {}) {
    return fetch(url, {
        method: method,
        headers: {
            'X-CSRF-TOKEN' : token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
}

// 북마크 목록 가져오기
async function getBookmarkList() {
    //누비자 api를 이용해 각 정거장 정보 가져오기
    let nubijaResponse = await fetch('/nubija');
    let nubijaJson = await nubijaResponse.json();
    const terminalInfoList = nubijaJson.TerminalInfo;

    // 회원별 북마크한 정거장 정보 가져오기
    let bookmarkStationResponse = await fetch(`${location.pathname}/station`);
    let bookmarkStationJson = await bookmarkStationResponse.json();

    bookmarkStationJson.stations.forEach(function(item) {
        let stationId = item.stationId.toString();
        let terminalInfo = terminalInfoList.find(info => info.Vno === stationId)
        templatingHtml.stationList(bookmarkStationList, terminalInfo);
    })

    // 회원별 북마크한 경로 정보 가져오기
    let bookmarkRouteResponse = await fetch(`${location.pathname}/route`);
    let bookmarkRouteJson = await bookmarkRouteResponse.json();
    bookmarkRouteJson.routes.forEach(item => {
        let depId = item.departureStationId.toString();
        let desId = item.destinationStationId.toString();
        let depTerminalInfo = terminalInfoList.find(info => info.Vno === depId);
        let desTerminalInfo = terminalInfoList.find(info => info.Vno === desId);
        templatingHtml.routeList(bookmarkRouteList, item, depTerminalInfo, desTerminalInfo);
    })
}

getBookmarkList();

// 클릭 이벤트리스너
tabMenu.addEventListener('click', (evt) => {
    if (window.innerWidth <= 560) {
        let li = evt.target.closest("li");
        if (!li.classList.contains('active')){
            tabMenu.querySelector('.active').classList.remove('active');
            li.classList.add('active');
            document.querySelector(`#bookmark-station`).classList.toggle("sm-hidden");
            document.querySelector(`#bookmark-route`).classList.toggle("sm-hidden");
        }
    }
})

bookmarkStationList.addEventListener('click', (evt)=>{
    let target = evt.target;
    let stationId = target.closest("li").id;
    if (target.closest("div").id === "bookmark-star") {
        target.closest("div").classList.toggle("active");
        target.closest("li").remove();
        // 북마크 delete fetch 요청
        fetchData('bookmark/station', 'PUT', {"stationId": stationId})
            .then(res => console.log('Success:', JSON.stringify(res)))
            .catch(error => console.error(error));

    } else if (target.closest("li").className==="list-item") {
        // stationId와 정류소 이름을 세션 스토리지에 담아서 /search로 이동한다.
        console.log(stationId);
    }
});
bookmarkRouteList.addEventListener('click', (evt)=>{
    let target = evt.target;
    let id = target.closest("li").id;
    if (target.closest("div").id === "bookmark-star") {
        target.closest("div").classList.toggle("active");
        target.closest("li").remove();
        // 북마크 delete fetch 요청
        fetchData('bookmark/route', 'PUT', {"id": id})
            .then(res => console.log('Success:', JSON.stringify(res)))
            .catch(error => console.error(error));

    } else if (target.closest("li").className==="list-item") {
        // 클릭된 리스트아이템 값들을 세션 스토리지에 담아서 /search로 이동한다.
        console.log(target.closest("li").id);
    }
});
