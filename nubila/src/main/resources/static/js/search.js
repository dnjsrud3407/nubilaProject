const token = document.querySelector("meta[name='_csrf']").content;
let tabMenu = document.querySelector("ul.tab-menu");
let listSection = document.querySelector(".list-section>ul");
let latlon = [35.22794668, 128.68185049]; // 창원시청 default
let isAuthentication = document.querySelector("#authentication");
let map;

// 마커
let selectedMarkerIndex;
let selectedPlaceMarker;
let markerArray = [];


async function getCurrentLatLon() {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(
            position => { resolve([position.coords.latitude, position.coords.longitude]) },
            error => { reject(error) });
    });
}

//지도에서 내 위치로 이동
async function Move(){
    //TODO 추후 위치 이동하면서 체크해야 함
    //if (isLocationAccessed) { latlon = await getCurrentLatLon()}
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
function loadGetLonLatFromAddress() {
    let tData = new Tmapv2.extension.TData();
    let optionObj = {
        coordType: "WGS84GEO", //응답좌표 타입 옵션 설정
        addressType: "A04"     //주소타입 옵션 설정
    };
    let params = {
        onComplete: onComplete,
        onProgress: onProgress,
        onError: onError
    };
    // TData 객체의 리버스지오코딩 함수
    tData.getAddressFromGeoJson(latlon[0].toString(),latlon[1].toString(), optionObj, params);
}
function onComplete() {
    console.log(this._responseData);
}
function onProgress() {}
//데이터 로드 중 에러가 발생시 실행하는 함수
function onError(){
    console.log("리버스 지오 코딩 에러");
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
}

async function searchPlace(el) {
    let input = el.closest("input");
    if (!input) input = el.closest("form").querySelector("input");

    let searchKeyword = input.value;
    if (searchKeyword.length < 1) return;

    let url = "https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result";
    let data = {
        "appKey" : "l7xxb35a09b975b44680aa5d193b6e9a3814",
        "searchKeyword" : searchKeyword,
        "searchType" : "name",
        "areaLLCode" : "48",
        "areaLMCode": "120",
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
    let nubijaResponse = await fetch('/nubija');
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
        marker.addListener("click", function() {
            let listItem = document.querySelector(`.list-section>ul>li:nth-child(${index+1})`);
            if(selectedMarkerIndex!==undefined) {
                let aniListItem = document.querySelector(`.list-section>ul>li:nth-child(${selectedMarkerIndex+1})`);
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
        let bookmarkStationResponse = await fetch(`bookmark/station`);
        let bookmarkStationJson = await bookmarkStationResponse.json();
        bookmarkStationIds = bookmarkStationJson.stations
            .map(item => {
                return item.stationId
            })
    }

    let listSection = document.querySelector(".list-section>ul");
    listSection.innerHTML = "";
    sortedTerminalInfoList5.forEach(item => {
        let template =
            `<li class="list-item" id="${item.Vno}">
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
                        <li><a onclick="searchRouteClickHandler(this)">출발</a></li>
                        <li><a onclick="searchRouteClickHandler(this)">도착</a></li>
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
async function searchEventHandler(evt, el) {
    evt.preventDefault();
    if (evt.key !== 'Enter' && evt.target.tagName !== "BUTTON") return;

    let result = await searchPlace(el);
    console.log(result);
    let listSection = document.querySelector(".list-section>ul");
    listSection.innerHTML = '';

    markerArray.forEach(item => item.setMap(null))
    let latlonBounds = new Tmapv2.LatLngBounds(); // 범위 지정

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
            listSection.innerHTML +=
                `<li class="list-item ${index}">
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
                        <div class="btn-group">
                            <ul id="search-btn-group">
                                    <li><a onclick="searchRouteClickHandler(this)">출발</a></li>
                                    <li><a onclick="searchRouteClickHandler(this)">도착</a></li>
                            </ul>
                            <div class="nearby-btn"><button>주변 정류소 보기</button></div>
                        </div>
                    </li>`;
        })
    map.fitBounds(latlonBounds);
    if (map.getZoom()> 16) map.setZoom(16);
}

let departure;
let destination;
let depMarker;
let desMarker;
function searchRouteClickHandler(item) {
    markerArray.forEach(marker => marker.setMap(null));
    tabMenu.querySelector("#nearby-staion-btn").classList.remove("active");
    tabMenu.querySelector("#route-section-btn").classList.add("active");

    let searchContainer = document.querySelector(".search-container");
    searchContainer.querySelector("#search-place-section").classList.add("hidden");
    searchContainer.querySelector("#search-route-section").classList.remove("hidden");
    let listItem = item.closest(".list-item");
    listItem.classList.add("selected")

    listSection.querySelectorAll(".btn-group").forEach(el => el.remove());

    if (item.textContent==="출발") {
        let depInput = searchContainer.querySelector("#dep-search-input");
        depInput.value = listItem.querySelector(".place-name").innerText;
        departure = {
            "name" : depInput.value,
            "lat" : Number(listItem.querySelector("input[name='lat']").value),
            "lon" : Number(listItem.querySelector("input[name='lon']").value),
            "isTerminal" : (listItem.id)? listItem.id : false
        }
        if (depMarker) depMarker.setMap(null);
        depMarker = new Tmapv2.Marker(
            {
                position : new Tmapv2.LatLng(departure.lat, departure.lon),
                icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
                title : departure.name,
                map : map
            });
    } else if (item.textContent==="도착") {
        let desInput = searchContainer.querySelector("#des-search-input");
        desInput.value = listItem.querySelector(".place-name").innerText;
        destination = {
            "name" : desInput.value,
            "lat" : Number(listItem.querySelector("input[name='lat']").value),
            "lon" : Number(listItem.querySelector("input[name='lon']").value),
            "isTerminal" : (listItem.id)? listItem.id : false
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
}
async function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}
let depTerminalMarker;
let desTerminalMarker;
let polyline;

function cleanMap() {
    if (depTerminalMarker) {
        depTerminalMarker.setMap(null);
        depTerminalMarker = null;
    }
    if (desTerminalMarker) {
        desTerminalMarker.setMap(null);
        desTerminalMarker = null;
    }
    if (polyline) {
        polyline.setMap(null);
        polyline = null;
    }
    if (selectedPlaceMarker) {
        selectedPlaceMarker.setMap(null);
        selectedPlaceMarker = null;
    }
    if (markerArray.length>0) {
        markerArray.forEach(m => m.setMap(null));
        markerArray = [];
    }
}
let sortedDepTerminalInfo3;
let sortedDesTerminalInfo3;
let routeResult =[];
function drawRoute(index, sortedDepTerminalInfo3, sortedDesTerminalInfo3, routeResult) {
    cleanMap();
    let drawInfoArr = [];
    depTerminalMarker = new Tmapv2.Marker({
        position : new Tmapv2.LatLng(sortedDepTerminalInfo3[routeResult[index].depIndex].Latitude, sortedDepTerminalInfo3[routeResult[index].depIndex].Longitude),
        icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_1.png",
        title : sortedDepTerminalInfo3[routeResult[index].depIndex].Tmname,
        map:map
    });
    desTerminalMarker = new Tmapv2.Marker({
        position : new Tmapv2.LatLng(sortedDesTerminalInfo3[routeResult[index].desIndex].Latitude, sortedDesTerminalInfo3[routeResult[index].desIndex].Longitude),
        icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_2.png",
        title : sortedDesTerminalInfo3[routeResult[index].desIndex].Tmname,
        map:map
    });
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
}
function removeEl(btn) {
    let div = btn.closest("div");
    div.remove();
}
function divAlert(message) {
    let div = `<div class="alert"><span>${message}</span><button title="삭제하기" onclick="removeEl(this)">x</button></div>`
    document.querySelector(".search-wrap").insertAdjacentHTML('afterbegin', div);
}
async function base() {
    try {
        latlon = await getCurrentLatLon();
    } catch (e) {
        divAlert("위치 액세스가 거부되어 기본 위치(창원시청)로 내 위치가 지정됩니다. 내 위치를 확인하려면 위치 액세스를 허용해주세요.");
    }
    initTmap();

    departure = {
        "name" : "내 위치",
        "lat" : latlon[0],
        "lon" : latlon[1],
        "isTerminal" : false
    }

    //내 근처 터미널 조회
    getNearbyTermianl(latlon);

    //장소 검색
    let searchBtn = document.querySelector("#place-search-btn");
    searchBtn.addEventListener("click", evt => searchEventHandler(evt, evt.target));

    let depSearchBtn = document.querySelector("#dep-search-btn");
    depSearchBtn.addEventListener("click", evt => searchEventHandler(evt, evt.target));
    let desSearchBtn = document.querySelector("#des-search-btn");
    desSearchBtn.addEventListener("click", evt => searchEventHandler(evt, evt.target));

    //길 찾기
    let searchRouteBtn = document.querySelector("#search-route-btn");
    searchRouteBtn.addEventListener("click", async function(evt) {
        evt.preventDefault();
        if (!destination) {
            document.querySelector("input#des-search-input").focus();
        } else if (departure && destination) {
            let nubijaJson = await fetch('/nubija').then(res => res.json());
            let terminalInfoList = nubijaJson.TerminalInfo;

            // 거리계산 후 정렬 (가까운 거리 최대 n개 터미널까지)
            terminalInfoList.forEach( item => {
                // 배열 내 객체에 계산된 거리 속성 추가
                item.depDist = haversine([departure.lat, departure.lon], [item.Latitude, item.Longitude]);
                item.desDist = haversine([destination.lat, destination.lon], [item.Latitude, item.Longitude]);
            })
            // 오름차순 정렬하고 3개로 자르기
            sortedDepTerminalInfo3 = terminalInfoList.sort((a, b) => a.depDist - b.depDist).slice(0, 3);
            sortedDesTerminalInfo3 = terminalInfoList.sort((a, b) => a.desDist - b.desDist).slice(0, 3);
            console.log(sortedDepTerminalInfo3, sortedDesTerminalInfo3);

            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    let passList =
                        `${sortedDepTerminalInfo3[i].Longitude},${sortedDepTerminalInfo3[i].Latitude}_${sortedDesTerminalInfo3[j].Longitude},${sortedDesTerminalInfo3[j].Latitude}`;
                    let url = "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result";
                    let data = {
                        "appKey" : "l7xxb35a09b975b44680aa5d193b6e9a3814",
                        "startX" : `${departure.lon}`,
                        "startY" : `${departure.lat}`,
                        "endX" : `${destination.lon}`,
                        "endY" : `${destination.lat}`,
                        "passList" : passList,
                        "reqCoordType" : "WGS84GEO",
                        "resCoordType" : "WGS84GEO",
                        "startName" : `${departure.name}`,
                        "endName" : `${destination.name}`,
                        "searchOption" : 30
                    };
                    let temp;
                    try {
                        let searchRouteResponse = await fetch(url, {
                            method: 'POST',
                            body: new URLSearchParams(data)
                        });
                        let searchRouteJson = await searchRouteResponse.json();
                        temp = {
                            route: searchRouteJson.features,
                            depIndex: i,
                            desIndex: j
                        };
                        routeResult.push(temp);
                    } catch (e) {
                        console.log(`response error: ${e}`);
                    }
                    await sleep(500); // 티맵 api 무료 이용시 1분에 2회 요청 제한
                }
            }

            console.log(routeResult);

            // 리스트 작성하기
            let listSection = document.querySelector(".list-section>ul");
            listSection.querySelectorAll("li").forEach(item => item.remove());
            routeResult.forEach((item, index) => {
                let template =
                    `<li class="list-item ${index}">
                        <div>
                            <div>
                                 출발지 ${departure.name}
                            </div>
                            <div>
                                → 도착지 ${destination.name}
                            </div>
                            <div>
                                출발 터미널 ${sortedDepTerminalInfo3[item.depIndex].Tmname}
                            </div>
                            <div>
                                <span>빈 보관대 수 ${sortedDepTerminalInfo3[item.depIndex].Emptycnt}</span>
                                <span>주차된 자전거 수 ${sortedDepTerminalInfo3[item.depIndex].Parkcnt}</span>
                            </div>
                            <div>
                                도착 터미널 ${sortedDesTerminalInfo3[item.desIndex].Tmname}
                            </div>
                            <div>
                                <span>빈 보관대 수 ${sortedDesTerminalInfo3[item.desIndex].Emptycnt}</span>
                                <span>주차된 자전거 수 ${sortedDesTerminalInfo3[item.desIndex].Parkcnt}</span>
                            </div>
                            <div>
                                <span>총 이동거리 ${item.route[0].properties.totalDistance} m</span>
                            </div>
                        </div>
                        <div class="btn-group">
                            {bookmark-star}
                        </div>
                    </li>`
                let star = "";
                if (isAuthentication!== null) {
                    if (false) { //TODO 조건절 완성
                        star = `<div id="bookmark-star" class="active">
                                <i class="fas fa-star"></i>
                            </div>`;
                    }
                    else {
                        star = `<div id="bookmark-star" class>
                            <i class="fas fa-star"></i>
                        </div>`;
                    }
                }
                template = template.replace("{bookmark-star}", star);
                listSection.innerHTML += template;
            });

            // 맵에 첫번째 경로 그리기
            drawRoute(0, sortedDepTerminalInfo3, sortedDesTerminalInfo3, routeResult);

        }
    })
}

base();

// 클릭 이벤트리스너
tabMenu.addEventListener('click', (evt) => {
    let li = evt.target.closest("li");
    if (!li.classList.contains('active')){
        tabMenu.querySelector('.active').classList.remove('active');
        li.classList.add('active');
        let searchPlaceSection = document.querySelector(`#search-place-section`);
        searchPlaceSection.classList.toggle("hidden");
        let searchRouteSection = document.querySelector(`#search-route-section`);
        searchRouteSection.classList.toggle("hidden");
        document.querySelectorAll(".list-section>ul>li").forEach(item => item.remove());

        cleanMap();
        if (depMarker) depMarker.setMap(null);
        if (desMarker) desMarker.setMap(null);

        if (li.id==="nearby-staion-btn") {
            searchPlaceSection.querySelector("#search-input").value = "";
            getNearbyTermianl(latlon);
        }
    }
})

listSection.addEventListener('click', (evt)=>{
    let target = evt.target;

    if (target.closest("div").id === "bookmark-star") {
        let stationId = target.closest("li").id;
        if (target.closest("div").className==="active") {
            target.closest("div").className = "";
            if (stationId) {
                // 북마크 station delete fetch 요청
                fetchData('bookmark/station', 'PUT', {"stationId": stationId}, true)
                    .then(res => console.log('Success:', JSON.stringify(res)))
                    .catch(error => console.error(error));
            } else {
                let list = target.closest("li");
                let data;
                fetchData('bookmark/route', 'PUT', data, true)
                    .then(res => console.log('Success:', JSON.stringify(res)))
                    .catch(error => console.error(error));
            }

        } else {
            target.closest("div").className = "active";
            if (stationId) {
                // 북마크 station add fetch 요청
                fetchData('bookmark/station', 'POST', {"stationId": stationId}, true)
                    .then(res => console.log('Success:', JSON.stringify(res)))
                    .catch(error => console.error(error));
            } else {
                let list = target.closest("li");
                let data;
                fetchData('bookmark/route', 'POST', data, true)
                    .then(res => console.log('Success:', JSON.stringify(res)))
                    .catch(error => console.error(error));
            }

        }
    } else if (target.closest("div").className === "nearby-btn") {
        let li = target.closest("li");
        getNearbyTermianl([Number(li.querySelector("input[name='lat']").value), Number(li.querySelector("input[name='lon']").value)], li.querySelector(".place-name").innerText);

    } else if (target.closest("li").classList[0]==="list-item" && target.closest("li").id==="") {
        let index = target.closest("li").classList[1];
        console.log(target.closest("li").classList[1]);
        drawRoute(index, sortedDepTerminalInfo3, sortedDesTerminalInfo3, routeResult);
    }
});