
const contextPath = $('#contextPathHolder').attr('data-contextPath') ? $('#contextPathHolder').attr('data-contextPath') : '';
const token = $("meta[name='_csrf']").attr("content");
const header = $("meta[name='_csrf_header']").attr("content");

// DOMLOAD 시, 공지 사항 리스트 불러오기

document.addEventListener("DOMContentLoaded", ajaxGet(contextPath+"/notice", getNotices));


// 사이드 nav 메뉴 클릭 이벤트 등록s
let ul = document.querySelector("#side-menu");

function select(ul, li){
	Array.from(ul.children).forEach(v =>
		v.classList.remove('selected')
	)
	if(li) {
		li.classList.add('selected');
	}
}

ul.addEventListener("click", function(evt){		
	if(evt.target.tagName === "LI"){
		select(ul, evt.target);
		switch(evt.target.id){
			case 'notice':
				ajaxGet(contextPath+"/notice", getNotices);
				break;
			case 'inquery':
				registerInquery();
				break;
			case 'myinquery':
				ajaxGet(contextPath+"/myinquery", getInqueries);
				break;
		}
	}
});

//AJAX
function ajaxGet(url, func) {
	const oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function(){
		let data = JSON.parse(this.responseText);
		func(data);	
	});
	oReq.open("GET", url);
	oReq.send();
}

function ajaxPost(url, data, Get, getUrl, func){
	let oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function(){
		//getajax
		if (Get) {
			ajaxGet(getUrl, func);
		}
	});
	oReq.open("POST", url);
	oReq.setRequestHeader('Content-type', 'application/json');
	oReq.setRequestHeader(header, token);
	oReq.send(data);
}

// 공지사항 목록 불러오기
function getNotices(data) {
	//table 추가
	let container = document.querySelector("#container");
	let table = document.querySelector("#table-template").innerHTML;
	container.innerHTML = table;
	
	//h1 변경
	document.querySelector("#menu-name").innerText = "공지 사항";

	//반복문으로 tbody 변경
	let tb = document.querySelector("tbody");
	let template = document.querySelector("#table-list-template").innerHTML;
	let resultHTML = "";
	data.list.forEach(el => 
		resultHTML += template.replace(/{id}/gi, el.id)
		.replace("{title}", el.title).replace("{createDate}", el.createDate.slice(0, 10)).replace("{func}","getNoticeDetail"));
	tb.innerHTML = resultHTML;	
}

//공지사항 상세보기
function setNoticeDetail(data){
	let el = data.content;
	
	let container = document.querySelector("#container");
	let template = document.querySelector("#noticedetail-template").innerHTML;
	container.innerHTML = template.replace("{title}", el.title)
	.replace(/{content}/gi, el.content)
	.replace("{createDate}", el.createDate.slice(0, 10));

	let listBtn = document.getElementById("noticelist-btn");
	listBtn.addEventListener("click", () => { ajaxGet(contextPath+"/notice", getNotices)} );
}

function getNoticeDetail(data){
	let url = contextPath+"/noticedetail/" + data;
	ajaxGet(url, setNoticeDetail);
}

// 문의 내역 등록하기
function registerInquery(){
	let container = document.querySelector("#container");
	let inqueryform = document.querySelector("#inquery-template").innerHTML;
	container.innerHTML = inqueryform;

	ClassicEditor
	.create( document.querySelector('#content'))
		.then( newEditor => {
			editor = newEditor;
		})
	.catch( error => {
		console.error( error );
	} );
}

function writeInquery(){
	let data = JSON.stringify({
		title: document.getElementById('title').value,
		content: editor.getDate(),
		status: "normal"
	})
	// console.log(data);
	ajaxPost(contextPath+"/inquery", data);
	document.getElementById('title').value = "";
	document.getElementById('content').value = "";
}
// 내 문의 내역 목록 불러오기
function getInqueries(data){
	//table 추가
	let container = document.querySelector("#container");
	let table = document.querySelector("#table-template").innerHTML;
	container.innerHTML = table;
	
	//h1 변경
	document.querySelector("#menu-name").innerText = "문의 내역";
	let tb = document.querySelector("tbody");
	let contents = data.list;
	if(contents.length != 0){
		//반복문으로 tbody 변경
		let template = document.querySelector("#table-list-template").innerHTML;
		let resultHTML = "";
		contents.forEach(el =>
			resultHTML += template.replace(/{id}/gi, el.id)
				.replace("{title}", el.title).replace("{createDate}", el.createDate.slice(0, 10)).replace("{func}","getInqueryDetail"));
		tb.innerHTML = resultHTML;
	}else {
		tb.innerHTML = "<tr><td colspan='3'>문의하신 내역이 없습니다.</td></tr>"
	}
}
	// 문의 내역
function getAnswersById(data){
	let contents = data.list;
	console.log(contents);
	if(contents.length != 0){
		let answers = document.querySelector("#answers");
		let template = document.querySelector("#answer-template").innerHTML;
		let resultHTML = "";
		contents.forEach((el) => {
			resultHTML += template.replace("{id}", el.id).replace("{content}", el.content)
			.replace("{createDate}", el.createDate.slice(0, 10)).replace("{writer}", el.writer)
			if (el.writer = "USER"){
				// 수정, 삭제 버튼 생성
				resultHTML = resultHTML.slice(0, -7) + "<button type='button' class='btn btn-warning btn-sm' onclick='deleteAnswer()'>삭제</button>" + resultHTML.slice(-7);
				resultHTML = resultHTML.replace("{class}", "");
			}else {
				// 색깔 변경
				resultHTML = resultHTML.replace("{class}", " list-group-item-success");
			}});
		answers.innerHTML = resultHTML;
	}
}

function registerAnswer(){
	let inqueryId =document.getElementById("inquery-id").value;
	let data = JSON.stringify({
		inqueryId: inqueryId,
		content: document.getElementById('writeanswerarea').value,
		status:'normal'
	});
	ajaxPost(contextPath+"/answer", data, true, contextPath+"/answer/"+inqueryId, getAnswersById);
	document.getElementById('writeanswerarea').value = "";
}

function deleteAnswer(){
	let data = JSON.stringify({
		id: document.getElementById("answerId").value,
		content: document.getElementById("answerContent").innerText,
		status: 'deleted'
	})
	let inqueryId = document.getElementById("inquery-id").value;
	ajaxPost(contextPath+"/answer", data, true, contextPath+"/answer/"+inqueryId, getAnswersById);
}

function setInqueryDetail(data){
	let el = data.content;
	let container = document.querySelector("#container");
	let template = document.querySelector("#myinquery-template").innerHTML;
	container.innerHTML = template.replace("{id}", el.id).replace("{title}", el.title)
	.replace("{createDate}", el.createDate.slice(0, 10)).replace("{modifyDate}", el.modifyDate.slice(0, 10)).replace("{content}", el.content);
	
	ajaxGet(contextPath+"/answer/"+el.id, getAnswersById);

	let listBtn = document.getElementById("list-btn");
	listBtn.addEventListener("click", () => { ajaxGet(contextPath+"/myinquery", getInqueries)} );
}

function getInqueryDetail(id){
	let url = contextPath+"/inquerydetail/" + id;
	ajaxGet(url, setInqueryDetail);
}

function deleteInquery(){
	let data = JSON.stringify({
		id: document.getElementById('inquery-id').value,
		title: document.getElementById('inquery-title').innerText,
		content: document.getElementById('inquery-content').innerText,
		status: "deleted"
	})
	ajaxPost(contextPath+"/inquery", data, true, contextPath+"/myinquery", getInqueries);
}
