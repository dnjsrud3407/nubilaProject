'use strict';
const bookmarkStationList = document.querySelector("#bookmark-station-list");
const bookmarkRouteList = document.querySelector("#bookmark-route-list");
const tabMenu = document.querySelector(".tab-menu");
let bookmarkRouteJson;

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
                        <span>주차된 자전거 수 ${terminalInfo.Parkcnt}</span>
                        <span>빈 보관대 수 ${terminalInfo.Emptycnt}</span>
                    </div>
                </div>
                <div class="btn-group bookmark-btn">
                    <ul id="search-btn-group">
                        <li><a>출발</a></li>
                        <li><a>도착</a></li>
                    </ul>
                    <div id="bookmark-star" class="active"><i class="fas fa-star"></i></div>
                </div>
            </li>`;
    },
    routeList : function (Element, item, depTerminalInfo, desTerminalInfo) {
        Element.innerHTML +=
            `<li class="list-item" id="${item.id}">
                <div>
                    <div>출발지 <span id="departure-name">${item.departureName}</span> </div>
                    <div>→ 도착지 <span id="destination-name">${item.destinationName}</span></div>         
                </div>
                <div class="btn-group bookmark-btn">
                    <div id="bookmark-star" class="active"><i class="fas fa-star"></i></div>
                </div>
            </li>`;
    }
}

// fetch with data
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
    let nubijaResponse = await fetch('/nubija', {headers : {'X-CSRF-TOKEN' : token}});
    let nubijaJson = await nubijaResponse.json();
    const terminalInfoList = nubijaJson.TerminalInfo;

    // 회원별 북마크한 정거장 정보 가져오기
    let bookmarkStationResponse = await fetch(`${location.pathname}/station`, {headers : {'X-CSRF-TOKEN' : token}});
    let bookmarkStationJson = await bookmarkStationResponse.json();
    console.log( bookmarkStationJson.stations);
    bookmarkStationJson.stations.forEach(function(item) {
        let stationId = item.stationId.toString();
        let terminalInfo = terminalInfoList.find(info => info.Vno === stationId)
        templatingHtml.stationList(bookmarkStationList, terminalInfo);
    })

    // 회원별 북마크한 경로 정보 가져오기
    let bookmarkRouteResponse = await fetch(`${location.pathname}/route`, {headers : {'X-CSRF-TOKEN' : token}});
    bookmarkRouteJson = await bookmarkRouteResponse.json();
    bookmarkRouteJson.routes.forEach(item => {
        // let depId = item.departureStationId.toString();
        // let desId = item.destinationStationId.toString();
        // let depTerminalInfo = terminalInfoList.find(info => info.Vno === depId);
        // let desTerminalInfo = terminalInfoList.find(info => info.Vno === desId);
        templatingHtml.routeList(bookmarkRouteList, item); //, depTerminalInfo, desTerminalInfo);
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
    let stationId = target.closest(".list-item").id;
    if (target.closest("div").id === "bookmark-star") {
        target.closest("div").classList.toggle("active");
        target.closest("li").remove();
        // 북마크 delete fetch 요청
        fetchData('bookmark/station', 'PUT', {"stationId": stationId})
            .then(res => console.log('Success:', JSON.stringify(res)))
            .catch(error => console.error(error));

    } else if (target.closest("ul").id==="search-btn-group") {
        // stationId와 정류소 이름을 세션 스토리지에 담아서 /search로 이동한다.
        switch (target.textContent) {
            case "출발":
                sessionStorage.setItem("searchParam", JSON.stringify({ "dep" : {"stationId" : stationId}}));
                break;
            case "도착":
                sessionStorage.setItem("searchParam", JSON.stringify({ "des" : {"stationId" : stationId}}));
                break;
        }
        location.href = "/search";
    }
});
bookmarkRouteList.addEventListener('click', (evt)=>{
    let target = evt.target;
    let listItem = target.closest("li");
    if (target.closest("div").id === "bookmark-star") {
        target.closest("div").classList.remove("active");
        // 북마크 delete fetch 요청
        let data = {
            departureName: listItem.querySelector("#departure-name").textContent,
            destinationName: listItem.querySelector("#destination-name").textContent
        }
        listItem.remove();
        fetchData('bookmark/route', 'PUT', data)
            .then(res => console.log('Success:', JSON.stringify(res)))
            .catch(error => console.error(error));

    } else if (listItem && listItem.className==="list-item") {
        // 클릭된 리스트아이템 값들을 세션 스토리지에 담아서 /search로 이동한다.
        let data = bookmarkRouteJson.routes.find(item => item.id === Number(listItem.id));
        sessionStorage.setItem("searchParam", JSON.stringify({"route" : data}));
        location.href = "/search";
    }
});
