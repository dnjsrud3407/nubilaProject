const token = document.querySelector("meta[name='_csrf']").content;
let tabMenu = document.querySelector("ul.tab-menu");
let listSection = document.querySelector("#result-list-section>ul");
let isAuthentication = document.querySelector("#authentication");

let latlon = [35.22794668, 128.68185049]; // 창원시청 default
let myLocation;
let isLocationAccessed;
let map;
let departure;
let destination;

let selectedIndex;
let selectedMarkerIndex;

// 마커
let markerArray = [];
let selectedPlaceMarker;
let depMarker;
let desMarker;

async function getCurrentLatLon() {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(
            position => { resolve([position.coords.latitude, position.coords.longitude]) },
            error => { reject(error) });
    });
}

//지도에서 내 위치로 이동
async function setMyLocation(){
    //TODO 추후 위치 이동하면서 체크해야 함
    if (isLocationAccessed) {
        latlon = await getCurrentLatLon();
        let result = await reverseGeoTmap(latlon[0], latlon[1]);
        myLocation = {
            "name" : result,
            "lat" : latlon[0],
            "lon" : latlon[1],
            "isTerminal" : 0
        };
    }
    map.setCenter(new Tmapv2.LatLng(latlon[0], latlon[1])); // 지도의 중심 좌표를 설정합니다.
}
function initTmap(){
    // map 생성
    // Tmapv2.Map을 이용하여, 지도가 들어갈 div, 넓이, 높이를 설정합니다.
    map = new Tmapv2.Map("map_div", {
        center: new Tmapv2.LatLng(latlon[0], latlon[1]),
        width: "100%",
        height: "400px",
        zoomControl : true,
        scrollwheel : true,
    });
    let myMarker = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(latlon[0], latlon[1]), //Marker의 중심좌표 설정.
        icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_m.png",
        map: map,
        title: "내 위치"
    });
}
//좌표의 주소를 얻기 위한 리버스 지오코딩 요청 함수
async function reverseGeoTmap(lat, lon) {
    let url = "https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result";
    let data = {
        "appKey" : "l7xxb35a09b975b44680aa5d193b6e9a3814",
        "coordType" : "WGS84GEO",
        "addressType" : "A04",
        "lon" : lon,
        "lat" : lat
        }
    let response = await fetchGet(url, data);
    let result = response.addressInfo;
    return (result.buildingName)? result.buildingName : result.fullAddress;
}
function fetchData(url = '', method ='' ,data = {}, csrfToken=true) {
    let headers = {'Content-Type': 'application/json'}
    if (csrfToken) {
        headers = {
            'X-CSRF-TOKEN' : token,
            'Content-Type': 'application/json',
        }
    }
    return fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(data)
    })
        .then(response => response.json())
}
function fetchGet(url = '', param = {}) {
    if (param) url += '&' + ( new URLSearchParams( param ) ).toString();
    return fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json;charset=utf-8'}
    }).then(response => response.json())
        .catch(error => console.error("검색 에러가 발생하였습니다."));
}
async function searchPlaceTmap(searchKeyword) {
    let url = "https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result";
    let data = {
        "appKey" : "l7xxb35a09b975b44680aa5d193b6e9a3814",
        "searchKeyword" : searchKeyword,
        "searchType" : "name", // 명칭으로 검색시, 지역 코드 필요
        "areaLLCode" : "48", // 경남
        "areaLMCode": "120", // 창원
        "resCoordType" : "WGS84GEO",
        "reqCoordType" : "WGS84GEO",
        "searchtypCd" : "A", // 정확도 순
        // "centerLon" :  latlon[1],
        // "centerLat" :  latlon[0],
        //"radius" : 33, // 탐색 반경
        "poiGroupYn" : "Y",
        "count" : 10
    }
    let response = await fetchGet(url, data);
    return response.searchPoiInfo.pois.poi;
}
// 거리계산 함수 정의
function haversine(latlon1, latlon2) {
    const EARTH_RADIUS = 6371e3; // 지구반지름 (m단위)
    const TO_RADIAN = Math.PI / 180;

    // 좌표를 라디안 단위로 변환
    let radianDeltaLat = Math.abs(latlon1[0] - latlon2[0]) * TO_RADIAN;
    let radianDeltaLon = Math.abs(latlon1[1] - latlon2[1]) * TO_RADIAN;
    let radianLat1 = latlon1[0] * TO_RADIAN;
    let radianLat2 = latlon2[0] * TO_RADIAN;

    let squareRoot = Math.sqrt(Math.sin( radianDeltaLat / 2 )**2 +
        Math.cos(radianLat1) * Math.cos(radianLat2) * Math.sin( radianDeltaLon / 2 )**2);
    let distance = 2 * EARTH_RADIUS * Math.asin(squareRoot);
    return distance;
}
// 주변 터미널 조회
async function getNearbyTermianl(pos, title="내 위치") {
    if (markerArray.length>0) markerArray.forEach(m => m.setMap(null));
    if (title !== "내 위치") {
        selectedPlaceMarker = new Tmapv2.Marker({
            position: new Tmapv2.LatLng(pos[0], pos[1]),
            icon: `http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_0.png`,
            map: map,
            title: title
        });
    }
    // 누비자 데이터 불러오기
    let nubijaResponse = await fetch('/nubija', {headers : {'X-CSRF-TOKEN' : token}});
    let nubijaJson = await nubijaResponse.json();
    let terminalInfoList = nubijaJson.TerminalInfo;

    // 거리계산 후 정렬 (가까운 거리 최대 5개 터미널까지)
    terminalInfoList.forEach( item => {
        item.dist = haversine(pos, [Number(item.Latitude), Number(item.Longitude)]);
    });
    let sortedTerminalInfoList5 = terminalInfoList.sort((a, b) => a.dist - b.dist).slice(0,5);

    let latlonBounds = new Tmapv2.LatLngBounds();
    markerArray = sortedTerminalInfoList5.map((item, index) => {

        let position = new Tmapv2.LatLng(item.Latitude, item.Longitude);
        latlonBounds.extend(position);

        // 지도에 마커 생성
        let marker = new Tmapv2.Marker({
            position : position,
            icon: `http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_${index+1}.png`,
            map : map,
            title : item.Tmname
        });
        return marker;
    })
    map.fitBounds(latlonBounds);
    if (map.getZoom()> 16) map.setZoom(16);

    markerArray.forEach( (marker, index) => {
        marker.addListener("click", function() { // 마커 클릭 이벤트 리스너 TODO 수정 필요
            let listItem = document.querySelector(`#result-list-section>ul>li:nth-child(${index+1})`);
            if(selectedMarkerIndex!==undefined) {
                let aniListItem = document.querySelector(`#result-list-section>ul>li:nth-child(${selectedMarkerIndex+1})`);
                aniListItem.classList.remove("selected");
            }
            listItem.classList.add("selected");
            selectedMarkerIndex = index;
        })
    })

    // 터미널 목록 리스트 생성하기
    // 회원별 북마크한 정거장 정보 가져오기
    let bookmarkStationIds;
    if (isAuthentication!== null) {
        let bookmarkStationResponse = await fetch(`bookmark/station`, {headers : {'X-CSRF-TOKEN' : token}});
        let bookmarkStationJson = await bookmarkStationResponse.json();
        bookmarkStationIds = bookmarkStationJson.stations
            .map(item => {
                return item.stationId
            })
    }
    let listSection = document.querySelector("#result-list-section>ul");
    listSection.innerHTML = "";
    sortedTerminalInfoList5.forEach((item, index) => {
        let template =
            `<li class="list-item ${index}" id="${item.Vno}">
                <div>
                    <div class="place-name">
                        ${item.Tmname}
                    </div>
                    <div>
                        <span>빈 보관대 수 ${item.Emptycnt}</span>
                        <span>주차된 자전거 수 ${item.Parkcnt}</span>
                    </div>
                    <input type="hidden" name="lat" value="${item.Latitude}" >
                    <input type="hidden" name="lon" value="${item.Longitude}">
                </div>
                <div class="btn-group">
                    <ul id="search-btn-group">
                        <li onclick="setDepDesClickHandler(this)"><a>출발</a></li>
                        <li onclick="setDepDesClickHandler(this)"><a>도착</a></li>
                    </ul>
                    {bookmark-star}
                </div>
            </li>`;

        if (isAuthentication!== null) {
            if (bookmarkStationIds.includes(parseInt(item.Vno))) item.bookmark = "active";
            else item.bookmark = "";
            let star = `<div id="bookmark-star" class="${item.bookmark}">
                            <i class="fas fa-star"></i>
                        </div>`;
            template = template.replace("{bookmark-star}", star);
        } else {
            template = template.replace("{bookmark-star}", "");
        }
        listSection.innerHTML += template;
    })
}
// 경로 탐색 이벤트
async function searchPlaceEventHandler(evt, el) {
    evt.preventDefault();
    if (evt.key !== 'Enter' && evt.target.tagName !== "BUTTON") return;

    let input = el.closest("input");
    if (!input) input = el.closest("form").querySelector("input");
    let searchKeyword = input.value;
    if (searchKeyword.length < 1) return;

    listSection.innerHTML = '';

    if (searchKeyword === "내 위치" || searchKeyword === "내위치") {
        setMyLocation();
        switch (el.id) {
            case "dep-search-btn" :
                departure = myLocation;
                document.querySelector("#dep-search-input").value = "내 위치";
                break;
            case "des-search-btn" :
                destination = myLocation;
                document.querySelector("#des-search-input").value = "내 위치";
                break;
        }
        return;
    }

    cleanMap();
    let result;
    try {
        result = await searchPlaceTmap(searchKeyword);
    } catch (e) {
        listSection.innerHTML = `<div class="info">검색된 결과가 없습니다. 검색명을 다시 확인해주세요.😥</div>`;
        return;
    }

    let latlonBounds = new Tmapv2.LatLngBounds(); // 범위 지정
    let template = "";
    result.slice(0, 5)
        .forEach( (item, index) => {
            let position = new Tmapv2.LatLng(item.noorLat, item.noorLon);
            latlonBounds.extend(position);
            let marker = new Tmapv2.Marker({
                position : position,
                map : map,
                icon: `http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_${index+1}.png`,
                title : item.name
            });
            markerArray[index] = marker;
            template +=`<li class="list-item ${index}">
                                <div>
                                    <div class="place-name">
                                        ${item.name}
                                    </div>
                                    <div>
                                        <div>${item.newAddressList.newAddress[0].fullAddressRoad}</div>
                                        <span>tel. ${item.telNo}</span>
                                        <input type="hidden" name="lat" value="${item.noorLat}">
                                        <input type="hidden" name="lon" value="${item.noorLon}">
                                    </div>
                                </div>
                                {btn-group}
                            </li>`;
        })
    if (el.id === "place-search-btn") {
        let btnGroup = `<div class="btn-group">
                                <ul id="search-btn-group">
                                        <li onclick="setDepDesClickHandler(this)"><a>출발</a></li>
                                        <li onclick="setDepDesClickHandler(this)"><a>도착</a></li>
                                </ul>
                                <div class="nearby-btn"><button>주변 정류소 보기</button></div>
                            </div>`;
        template = template.replaceAll("{btn-group}", btnGroup);
        listSection.innerHTML += template;
    } else {
        template = template.replaceAll("{btn-group}", "");
        listSection.innerHTML += template;
        let selectedPlace = listSection.firstChild;
        selectedPlace.classList.add("selected");
        switch (el.id) {
            case "dep-search-btn" :
                listSection.id = "searchDepPlaceResult";
                setDeparture(selectedPlace);
                break;
            case "des-search-btn" :
                listSection.id = "searchDesPlaceResult";
                setDestination(selectedPlace);
                break;
        }
    }
    map.fitBounds(latlonBounds);
    if (map.getZoom()> 16) map.setZoom(16);
}
function setDeparture(listItem) {
    let depInput = document.querySelector("#dep-search-input");
    depInput.value = listItem.querySelector(".place-name").innerText;
    selectedIndex = listItem.classList[1];
    departure = {
        "name" : listItem.querySelector(".place-name").innerText,
        "lat" : Number(listItem.querySelector("input[name='lat']").value),
        "lon" : Number(listItem.querySelector("input[name='lon']").value),
        "isTerminal" : (listItem.id)? listItem.id : 0
    }
    if (depMarker) depMarker.setMap(null);
    depMarker = new Tmapv2.Marker(
        {
            position : new Tmapv2.LatLng(departure.lat, departure.lon),
            icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
            title : departure.name,
            map : map
        });
}
function setDestination(listItem) {
    let desInput = document.querySelector("#des-search-input");
    desInput.value = listItem.querySelector(".place-name").innerText;
    selectedIndex = listItem.classList[1]
    destination = {
        "name" : desInput.value,
        "lat" : Number(listItem.querySelector("input[name='lat']").value),
        "lon" : Number(listItem.querySelector("input[name='lon']").value),
        "isTerminal" : (listItem.id)? listItem.id : 0
    }
    if (desMarker) desMarker.setMap(null);
    desMarker = new Tmapv2.Marker(
        {
            position : new Tmapv2.LatLng(destination.lat, destination.lon),
            icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
            title : destination.name,
            map : map
        });
}
function switchDepDesHandler() {
    let temp = departure;
    departue = destination;
    destination = temp;

    let tempName = document.querySelector("#dep-search-input").value;
    document.querySelector("#dep-search-input").value = document.querySelector("#des-search-input").value;
    document.querySelector("#des-search-input").value = tempName;
    if (listSection.id==="searchDepPlaceResult"){
        listSection.id = "searchDesPlaceResult";
    } else if (listSection.id==="searchDesPlaceResult") {
        listSection.id = "searchDepPlaceResult";
    }
}
// 출발, 도착 버튼 이벤트
function setDepDesClickHandler(item) {
    // 탭 메뉴 관련 DOM 조작
    tabMenu.querySelector("#nearby-staion-btn").classList.remove("active");
    tabMenu.querySelector("#route-section-btn").classList.add("active");
    let searchContainer = document.querySelector(".search-container");
    searchContainer.querySelector("#search-place-section").classList.add("hidden");
    searchContainer.querySelector("#search-route-section").classList.remove("hidden");

    // 선택 아이템 확인
    let listItem = item.closest(".list-item");
    listItem.classList.add("selected");
    selectedIndex = listItem.classList[1];
    // 아이템 리스트에서 버튼 제거
    listSection.querySelectorAll(".btn-group").forEach(el => el.remove());

    if (item.textContent==="출발") {
        listSection.id = "searchDepPlaceResult";
        setDeparture(listItem);
    } else if (item.textContent==="도착") {
        listSection.id = "searchDesPlaceResult";
        setDestination(listItem);
    }
}
async function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

let polyline;

function cleanMap() {
    if (markerArray.length>0) {
        markerArray.forEach(m => m.setMap(null));
        markerArray = [];
    }
    if (polyline) {
        polyline.setMap(null);
        polyline = undefined;
    }
    if (selectedPlaceMarker) {
        selectedPlaceMarker.setMap(null);
        selectedPlaceMarker = null;
    }
}
let DepTerminalInfoList;
let DesTerminalInfoList;
let routeResult =[];
function drawRoute(index, DepTerminalInfoList, DesTerminalInfoList, routeResult) {
    cleanMap();
    let drawInfoArr = [];
    let latlonBounds = new Tmapv2.LatLngBounds();
    latlonBounds.extend(new Tmapv2.LatLng(departure.lat, departure.lon));
    latlonBounds.extend(new Tmapv2.LatLng(destination.lat, destination.lon));

     markerArray.push(new Tmapv2.Marker({
        position : new Tmapv2.LatLng(DepTerminalInfoList[routeResult[index].depIndex].Latitude, DepTerminalInfoList[routeResult[index].depIndex].Longitude),
        icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_1.png",
        title : DepTerminalInfoList[routeResult[index].depIndex].Tmname,
        map:map
    }));
    markerArray.push(new Tmapv2.Marker({
        position : new Tmapv2.LatLng(DesTerminalInfoList[routeResult[index].desIndex].Latitude, DesTerminalInfoList[routeResult[index].desIndex].Longitude),
        icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_2.png",
        title : DesTerminalInfoList[routeResult[index].desIndex].Tmname,
        map:map
    }));

    routeResult[index].route.forEach((item, idx) => {
        let geometry = item.geometry;
        let properties = item.properties;

        if (geometry.type === 'LineString') {
            geometry.coordinates.forEach( coord => {
                drawInfoArr.push(new Tmapv2.LatLng(coord[1], coord[0]));
            })
        }
    })
    polyline = new Tmapv2.Polyline({
        path : drawInfoArr,
        strokeColor : "rgb(1,167,0)",
        strokeWeight : 5,
        map : map
    })
    map.fitBounds(latlonBounds);
}
function removeEl(btn) {
    let div = btn.closest("div");
    div.remove();
}
function divAlert(message) {
    let div = `<div class="alert"><span>${message}</span><button title="삭제하기" onclick="removeEl(this)">x</button></div>`
    document.querySelector(".search-wrap").insertAdjacentHTML('afterbegin', div);
}
async function searchRoute() {
    //TODO 내 위치로 경로 검색시 departure, destination 업데이트하기
    let listSection = document.querySelector("#result-list-section>ul");
    listSection.id = "searchRouteResult";
    listSection.querySelectorAll("li").forEach(item => item.remove());
    listSection.innerHTML = `<div class="info">경로를 탐색 중입니다. 잠시만 기다려주세요.😊</div>`;

    let nubijaResponse = await fetch('/nubija', {headers : {'X-CSRF-TOKEN' : token}} );
    let nubijaJson = await nubijaResponse.json();
    let terminalInfoList = nubijaJson.TerminalInfo;

    let passList = [];
    let temp = [];
    // 거리계산 후 정렬 (가까운 거리 최대 n개 터미널까지)
    if (departure.isTerminal===0 && destination.isTerminal===0) {
        terminalInfoList.forEach(item => {
            // 배열 내 객체에 계산된 거리 속성 추가
            item.depDist = haversine([departure.lat, departure.lon], [item.Latitude, item.Longitude]);
            item.desDist = haversine([destination.lat, destination.lon], [item.Latitude, item.Longitude]);
        })
        // 오름차순 정렬하고 2개로 자르기
        DepTerminalInfoList = terminalInfoList.sort((a, b) => a.depDist - b.depDist).slice(0, 3);
        DesTerminalInfoList = terminalInfoList.sort((a, b) => a.desDist - b.desDist).slice(0, 3);

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                passList.push(`${DepTerminalInfoList[i].Longitude},${DepTerminalInfoList[i].Latitude}_${DesTerminalInfoList[j].Longitude},${DesTerminalInfoList[j].Latitude}`);
                temp.push({depIndex: i, desIndex: j})
            }
        }
    } else if (departure.isTerminal===0) {
        terminalInfoList.forEach(item => {
            // 배열 내 객체에 계산된 거리 속성 추가
            item.depDist = haversine([departure.lat, departure.lon], [item.Latitude, item.Longitude]);
        })
        // 오름차순 정렬하고 2개로 자르기
        DepTerminalInfoList = terminalInfoList.sort((a, b) => a.depDist - b.depDist).slice(0, 3);
        DepTerminalInfoList.forEach((terminal, i) => {
            passList.push(`${terminal.Longitude},${terminal.Latitude}`);
            temp.push({depIndex: i, desIndex: 0});
        });
        console.log(destination.isTerminal);
        DesTerminalInfoList = [ terminalInfoList.find( item => item.Vno === String(destination.isTerminal) ) ];
    } else if (destination.isTerminal===0) {
        terminalInfoList.forEach(item => {
            // 배열 내 객체에 계산된 거리 속성 추가
            item.desDist = haversine([destination.lat, destination.lon], [item.Latitude, item.Longitude]);
        })
        // 오름차순 정렬하고 2개로 자르기
        DesTerminalInfoList = terminalInfoList.sort((a, b) => a.desDist - b.desDist).slice(0, 3);
        DesTerminalInfoList.forEach((terminal, j)=> {
            passList.push(`${terminal.Longitude},${terminal.Latitude}`);
            temp.push({depIndex: 0, desIndex: j});
        });
        DepTerminalInfoList = [ terminalInfoList.find( item => item.Vno === String(departure.isTerminal) ) ];
    }

    let i = 0;
    do {
        let url = "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result";
        let data = {
            "appKey" : "l7xxb35a09b975b44680aa5d193b6e9a3814",
            "startX" : `${departure.lon}`,
            "startY" : `${departure.lat}`,
            "endX" : `${destination.lon}`,
            "endY" : `${destination.lat}`,
            "reqCoordType" : "WGS84GEO",
            "resCoordType" : "WGS84GEO",
            "startName" : `${departure.name}`,
            "endName" : `${destination.name}`,
            "searchOption" : 30
        };
        if (passList.length>0) {
            data["passList"] = passList[i];
        }
        try {
            let searchRouteResponse = await fetch(url, {
                method: 'POST',
                body: new URLSearchParams(data)
            });
            let searchRouteJson = await searchRouteResponse.json();
            temp[i].route = searchRouteJson.features;
        } catch (e) {
            console.log(`response error: ${e}`);
        }
        i++
        await sleep(500); // 티맵 api 무료 이용시 1분에 2회 요청 제한
    } while (i < passList.length)

    routeResult = temp
        .filter(item => item.route !== undefined)
        .sort( (a, b) => a.route[0].properties.totalDistance - b.route[0].properties.totalDistance);

    // 리스트 작성하기
    if (routeResult.length > 0) {
        console.log(routeResult);
        listSection.innerHTML = "";
        console.log(DepTerminalInfoList);

        routeResult.forEach( (item, index) => {
            let template =
                `<li class="list-item ${index}">
                        <div>
                            <div>
                                출발 터미널 ${DepTerminalInfoList[item.depIndex].Tmname}
                            </div>
                            <div>
                                <span>빈 보관대 수 ${DepTerminalInfoList[item.depIndex].Emptycnt}</span>
                                <span>주차된 자전거 수 ${DepTerminalInfoList[item.depIndex].Parkcnt}</span>
                            </div>
                            <div>
                                도착 터미널 ${DesTerminalInfoList[item.desIndex].Tmname}
                            </div>
                            <div>
                                <span>빈 보관대 수 ${DesTerminalInfoList[item.desIndex].Emptycnt}</span>
                                <span>주차된 자전거 수 ${DesTerminalInfoList[item.desIndex].Parkcnt}</span>
                            </div>
                            <div>
                                <span>총 이동거리 ${item.route[0].properties.totalDistance} m</span>
                            </div>
                        </div>
                    </li>`
            listSection.innerHTML += template;
        });
        if (isAuthentication!== null) {
            // 북마크된 경로 리스트 요청
            let bookmarkedRoute;
            let bookmarkRouteResponse = await fetch("bookmark/route");
            let bookmarkRouteJson = await bookmarkRouteResponse.json();

            if (bookmarkRouteJson.routes.length > 0) {
                bookmarkedRoute = bookmarkRouteJson.routes.find(item => item.departureName===departure.name && item.destinationName===destination.name);
            }

            let star;
            if (bookmarkedRoute) {
                star = `<div id="bookmark-star" class="active">
                                <i class="fas fa-star"></i><span id="${bookmarkedRoute.id}"> 경로 즐겨찾기 삭제</span>
                            </div>`;
            }
            else {
                star = `<div id="bookmark-star" class>
                            <i class="fas fa-star"></i><span>경로 즐겨찾기 추가</span>
                        </div>`;
            }
            listSection.innerHTML += star;
        }

        // 맵에 첫번째 경로 그리기
        listSection.firstChild.classList.add("selected");
        selectedIndex = 0;
        drawRoute(selectedIndex, DepTerminalInfoList, DesTerminalInfoList, routeResult);

    } else {
        listSection.innerHTML = `<div class="info">경로 탐색 결과가 없습니다. 다시 확인해주세요.😥</div>`;
    }
}

async function base() {
    try {
        latlon = await getCurrentLatLon();
        isLocationAccessed = true;
    } catch (e) {
        divAlert("위치 액세스가 거부되어 기본 위치(창원시청)로 내 위치가 지정됩니다. 내 위치를 확인하려면 위치 액세스를 허용해주세요.");
        isLocationAccessed = false;
    }
    initTmap();

    let result = await reverseGeoTmap(latlon[0], latlon[1]);
    myLocation = {
        "name" : result,
        "lat" : latlon[0],
        "lon" : latlon[1],
        "isTerminal" : 0
    }
    departure = myLocation;

    // 세션스토리지 확인 분기
    let storageParam = sessionStorage.getItem("searchParam")
    sessionStorage.removeItem("searchParam");
    if ( storageParam === null) {
        //내 근처 터미널 조회
        getNearbyTermianl(latlon);
    } else {
        tabMenu.querySelector("#nearby-staion-btn").classList.remove("active");
        tabMenu.querySelector("#route-section-btn").classList.add("active");

        let searchContainer = document.querySelector(".search-container");
        searchContainer.querySelector("#search-place-section").classList.add("hidden");
        searchContainer.querySelector("#search-route-section").classList.remove("hidden");

        let Param = JSON.parse(storageParam);

        if (!Param.route) {
            // 누비자 데이터 불러오기
            let nubijaResponse = await fetch('/nubija', {headers : {'X-CSRF-TOKEN' : token}});
            let nubijaJson = await nubijaResponse.json();
            let terminalInfoList = nubijaJson.TerminalInfo;
            let terminalInfo;
            if (Param.dep) {
                let stationId = Param.dep.stationId;
                terminalInfo = terminalInfoList.find(item => item.Vno === String(stationId));
                departure = {
                    "name" : terminalInfo.Tmname,
                    "lat" : terminalInfo.Latitude,
                    "lon" : terminalInfo.Longitude,
                    "isTerminal" : stationId
                }
                document.querySelector("#dep-search-input").value = departure.name;
                if (depMarker) depMarker.setMap(null);
                depMarker = new Tmapv2.Marker({
                        position : new Tmapv2.LatLng(departure.lat, departure.lon),
                        icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
                        title : departure.name,
                        map : map
                    });
            } else if (Param.des) {
                let stationId = Param.des.stationId;
                terminalInfo = terminalInfoList.find(item => item.Vno === String(stationId));
                destination = {
                    "name" : terminalInfo.Tmname,
                    "lat" : terminalInfo.Latitude,
                    "lon" : terminalInfo.Longitude,
                    "isTerminal" : stationId
                }
                document.querySelector("#des-search-input").value = destination.name;
                if (desMarker) desMarker.setMap(null);
                desMarker = new Tmapv2.Marker({
                        position : new Tmapv2.LatLng(destination.lat, destination.lon),
                        icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
                        title : destination.name,
                        map : map
                    });
            }
            let template = `<li class="list-item 0 selected" id="${terminalInfo.Vno}">
                                <div>
                                    <div class="place-name">
                                        ${terminalInfo.Tmname}
                                    </div>
                                    <div>
                                        <span>주차된 자전거 수 ${terminalInfo.Parkcnt}</span>
                                        <span>빈 보관대 수 ${terminalInfo.Emptycnt}</span>
                                    </div>
                                    <input type="hidden" name="lat" value="${terminalInfo.Latitude}" >
                                    <input type="hidden" name="lon" value="${terminalInfo.Longitude}">
                                </div>
                            </li>`
            listSection.innerHTML = template;

        } else if (Param.route){
            let route = Param.route;
            console.log(route);
            departure = {
                "name" : route.departureName,
                "lat" : route.departureLat,
                "lon" : route.departureLon,
                "isTerminal" : (route.departureStationId)? route.departureStationId : 0
            }
            document.querySelector("#dep-search-input").value = departure.name;
            if (depMarker) depMarker.setMap(null);
            depMarker = new Tmapv2.Marker({
                    position : new Tmapv2.LatLng(departure.lat, departure.lon),
                    icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
                    title : departure.name,
                    map : map
                });
            destination = {
                "name" : route.destinationName,
                "lat" : route.destinationLat,
                "lon" : route.destinationLon,
                "isTerminal" : (route.destinationStationId)? route.departureStationId : 0
            }
            document.querySelector("#des-search-input").value = destination.name;
            if (desMarker) desMarker.setMap(null);
            desMarker = new Tmapv2.Marker({
                    position : new Tmapv2.LatLng(destination.lat, destination.lon),
                    icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
                    title : destination.name,
                    map : map
                });
            searchRoute();
        }
    }

    //장소 검색
    let searchBtn = document.querySelector("#place-search-btn");
    searchBtn.addEventListener("click", evt => searchPlaceEventHandler(evt, evt.target));

    let depSearchBtn = document.querySelector("#dep-search-btn");
    depSearchBtn.addEventListener("click", evt => searchPlaceEventHandler(evt, evt.target));
    let desSearchBtn = document.querySelector("#des-search-btn");
    desSearchBtn.addEventListener("click", evt => searchPlaceEventHandler(evt, evt.target));

    //길 찾기
    let searchRouteBtn = document.querySelector("#search-route-btn");
    searchRouteBtn.addEventListener("click", async function(evt) {
        evt.preventDefault();
        if (!destination) {
            document.querySelector("input#des-search-input").focus();
        } else if (!departure) {
            document.querySelector("input#dep-search-input").focus();
        } else if (departure && destination) {
            searchRoute();
        }
    })
}

base();

// 클릭 이벤트리스너
tabMenu.addEventListener('click', (evt) => {
    let li = evt.target.closest("li");
    if (li &&!li.classList.contains('active')){
        listSection.id = "";
        tabMenu.querySelector('.active').classList.remove('active');
        li.classList.add('active');
        let searchPlaceSection = document.querySelector(`#search-place-section`);
        searchPlaceSection.classList.toggle("hidden");
        let searchRouteSection = document.querySelector(`#search-route-section`);
        searchRouteSection.classList.toggle("hidden");
        Array.from(listSection.children).forEach(item => item.remove());

        cleanMap();
        if (depMarker) depMarker.setMap(null);
        if (desMarker) desMarker.setMap(null);

        if (li.id==="nearby-staion-btn") {
            searchPlaceSection.querySelector("#search-input").value = "";
            getNearbyTermianl(latlon);
        } else if(li.id === "route-section-btn") {
            searchRouteSection.querySelector("#dep-search-input").value = "내 위치";
            searchRouteSection.querySelector("#des-search-input").value = "";
            destination = null;
        }
    }
})

listSection.addEventListener('click', async (evt)=>{
    let target = evt.target;
    let div = target.closest("div");
    if (div && div.id === "bookmark-star") {
        if (div.className==="active") {
            div.className = "";
            if (listSection.id === "searchRouteResult") {
                // 북마크 route delete fetch 요청
                let routeId = div.querySelector("span").id;
                let data = {
                    departureName: departure.name,
                    destinationName: destination.name
                }
                fetchData('bookmark/route', 'PUT', data, true)
                    .then(res => console.log('Success:', JSON.stringify(res)))
                    .catch(error => console.error("에러가 발생하였습니다."));
            } else {
                // 북마크 station delete fetch 요청
                let stationId = target.closest("li").id;
                fetchData('bookmark/station', 'PUT', {"stationId": stationId}, true)
                    .then(res => console.log('Success:', JSON.stringify(res)))
                    .catch(error => console.error("에러가 발생하였습니다."));
            }
        } else {
            div.className = "active";
            if (listSection.id === "searchRouteResult") {
                let data = {
                    departureName: departure.name,
                    departureLat: departure.lat,
                    departureLon: departure.lon,
                    destinationName: destination.name,
                    destinationLat: destination.lat,
                    destinationLon: destination.lon,
                    departureStationId: departure.isTerminal,
                    destinationStationId: destination.isTerminal
                };

                // 북마크 route add fetch 요청
                fetchData('bookmark/route', 'POST', data, true)
                    .then(res => console.log('Success:', JSON.stringify(res)))
                    .catch(error => console.error("에러가 발생하였습니다."));
            } else {
                // 북마크 station add fetch 요청
                let stationId = target.closest("li").id;
                fetchData('bookmark/station', 'POST', {"stationId": stationId}, true)
                    .then(res => console.log('Success:', JSON.stringify(res)))
                    .catch(error => console.error("에러가 발생하였습니다."));
            }
        }
    } else if (div.className === "nearby-btn") {
        let li = target.closest("li");
        getNearbyTermianl([Number(li.querySelector("input[name='lat']").value), Number(li.querySelector("input[name='lon']").value)], li.querySelector(".place-name").innerText);

    } else if (listSection.id !== "" && target.closest("li").classList[0]==="list-item") {
        // 경로 결과 클릭이벤트
        listSection.querySelector(`li:nth-child(${Number(selectedIndex)+1})`).classList.remove("selected");
        let index = target.closest("li").classList[1];
        selectedIndex = index;
        target.closest("li").classList.add("selected");
        switch (listSection.id) {
            case "searchRouteResult" :
                drawRoute(index, DepTerminalInfoList, DesTerminalInfoList, routeResult);
                break;
            case "searchDepPlaceResult" :
                setDeparture(target.closest("li"));
                break;
            case "searchDesPlaceResult" :
                setDestination(target.closest("li"));
                break;
        }
    }
});