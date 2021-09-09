const contextPath = $('#contextPathHolder').attr('data-contextPath') ? $('#contextPathHolder').attr('data-contextPath') : '';
const token = $("meta[name='_csrf']").attr("content");
const header = $("meta[name='_csrf_header']").attr("content");

// 메뉴 버튼 클릭 이벤트 등록
function select(ul, li){
	Array.from(ul.children).forEach(v =>
		v.classList.remove('selected')
	)
	if(li) {
		li.classList.add('selected');
	}
}

let ul = document.querySelector("#side-menu");
ul.addEventListener("click", function(evt){		
	if(evt.target.tagName === "LI") {
		select(ul, evt.target);
		console.log(evt.target.id);
		switch(evt.target.id){
			case 'notice':
				ajaxGet(contextPath+"/notice", getNotices);
				break;
			case 'inquery':
				ajaxGet(contextPath+"/inquery", getInqueries);
				break;
			case 'user':
				ajaxGet(contextPath+"/userlist", getUsers);
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
		//모달창 닫기
		let modal = document.getElementById("modal");
		modal.style.display="none";
		//getajax
		if (Get){
			ajaxGet(getUrl, func);
		}
	});
	oReq.open("POST", url);
	oReq.setRequestHeader('Content-type', 'application/json');
	oReq.setRequestHeader(header, token);
	oReq.send(data);
}

// 공지 목록 불러오기
function getNotices(data) {
	//h1 변경
	document.querySelector("#menu-name").innerText = "공지 사항";

	let printSection = document.querySelector("#print-section");
	let table = document.querySelector("#table-template").innerHTML;
	printSection.innerHTML = table;
	
	//글작성 버튼 추가
	let parent = document.querySelector("#content-list");
	parent.insertAdjacentHTML("afterend", "<button type='button' id='writebtn' class='btn btn-success' onclick='writeNotice()'>글쓰기</button>");

	
	//반복문으로 tbody 변경
	let tb = document.querySelector("tbody");
	let template = document.querySelector("#content-list-template").innerHTML;
	let resultHTML = "";
	data.list.forEach(el => 
		resultHTML += template.replace(/{id}/gi, el.id)
		.replace("{title}", el.title).replace("{createDate}", el.createDate.slice(0, 10)).replace("{func}","getNoticeDetail")	);
	tb.innerHTML = resultHTML;	
}

// 공지 상세 보기
function setNoticeDetail(data){
	let el = data.content;
	let modal = document.getElementById("modal");
	modal.style.display="flex";
	
	let modalContent = document.querySelector(".modal-body");
	let template = document.querySelector("#modal-content-template").innerHTML;
	modalContent.innerHTML = template.replace(/{id}/gi, el.id).replace("{title}", el.title)
	.replace(/{content}/gi, el.content).replace("{status}", el.status)
	.replace("{createDate}", el.createDate.slice(0, 10)).replace("{modifyDate}", el.modifyDate.slice(0, 10)).replace("{menu}","notice");

	ClassicEditor
		.create( document.querySelector('#content'))
		.then( editor => {
			console.log( editor );
		} )
		.catch( error => {
			console.error( error );
		} );

	let closeBtn = document.querySelector(".btn-close");
	closeBtn.addEventListener("click", e => {
    modal.style.display = "none" });
    
    modal.addEventListener("click", e => {
	    let evTarget = e.target;
	    if(evTarget.classList.contains("modal-overlay")) {
	        modal.style.display = "none"
	    }
    })
}

function getNoticeDetail(data){
	let url = contextPath+"/noticedetail/" + data;
	ajaxGet(url, setNoticeDetail);
}
// 공지 입력
function writeNotice(url){
	let modal = document.getElementById("modal");
	modal.style.display="flex";
	
	let modalContent = document.querySelector(".modal-body");
	let template = document.querySelector("#modal-content-template").innerHTML;
	modalContent.innerHTML = template.replace(/{id}/gi, "").replace("{title}", "")
	.replace(/{content}/gi, "").replace("{status}", "normal");

	document.getElementById("createDate-div").style.display= "none";
	document.getElementById("modifyDate-div").style.display= "none";

	ClassicEditor
		.create( document.querySelector('#content'))
		.then( newEditor => {
			editor = newEditor;
		} )
		.catch( error => {
			console.error( error );
		} );
	
	let closeBtn = document.querySelector(".btn-close");
	closeBtn.addEventListener("click", e => {
    modal.style.display = "none" });
    
    modal.addEventListener("click", e => {
	    let evTarget = e.target;
	    if(evTarget.classList.contains("modal-overlay")) {
	        modal.style.display = "none"
	    }
    })
    
    document.querySelector(".modal-title").innerText = "내용 등록";
    
    document.getElementById("updatebtn").remove();
    document.getElementById("deletebtn").remove();    
    document.getElementById("createDate").remove();
    document.getElementById("modifyDate").remove();
    document.getElementById("createDate-label").remove();
    document.getElementById("modifyDate-label").remove();
    
	modalContent.insertAdjacentHTML("afterend", "<button type='button' id='registerbtn' class='btn btn-success btn-sm' onclick='registerNotice()'>등록</button>");
}

function registerNotice(){
	let data = JSON.stringify({
		title: document.getElementById('title').value,
		content: editor.getData(),
		status: document.getElementById('status').value
	})
	ajaxPost(contextPath+"/notice", data, true, contextPath+"/notice", getNotices);
}

// 공지 수정
function updateContent(){
	let data = JSON.stringify({
		id: document.getElementById('id').value,
		title: document.getElementById('title').value,
		content: editor.getData(),
		status: document.getElementById('status').value
	})
	ajaxPost(contextPath+"/notice", data);
}


// 공지 삭제
function deleteContent(menu){
	let data = JSON.stringify({
		id: document.getElementById('id').value,
		title: document.getElementById('title').value,
		content: document.getElementById('content').value,
		status: "deleted"
	})
	ajaxPost(contextPath+"/"+menu, data, true, contextPath+"/notice", getNotices);
}
// 문의사항 목록
function getInqueries(data) {
	//h1 변경
	document.querySelector("#menu-name").innerText = "문의 사항";

	let printSection = document.querySelector("#print-section");
	let table = document.querySelector("#table-template").innerHTML;
	printSection.innerHTML = table;
	
	//반복문으로 tbody 변경
	let tb = document.querySelector("tbody");
	let template = document.querySelector("#content-list-template").innerHTML;
	let resultHTML = "";
	data.list.forEach(el => 
		resultHTML += template.replace(/{id}/gi, el.id)
		.replace("{title}", el.title).replace("{createDate}", el.createDate.slice(0, 10)).replace("{func}","getInqueryDetail"));
	tb.innerHTML = resultHTML;	
}
// 문의사항 상세보기
function setInqueryDetail(data){
	let el = data.content;
	let modal = document.getElementById("modal");
	modal.style.display="flex";
	
	let modalContent = document.querySelector(".modal-body");
	let template = document.querySelector("#modal-content-template").innerHTML;
	modalContent.innerHTML = template.replace(/{id}/gi, el.id).replace("{title}", el.title)
	.replace(/{content}/gi, el.content).replace("{status}", el.status)
	.replace("{createDate}", el.createDate.slice(0, 10)).replace("{modifyDate}", el.modifyDate.slice(0, 10)).replace("{menu}","inquery");
	
	let closeBtn = document.querySelector(".btn-close");
	closeBtn.addEventListener("click", e => {
    modal.style.display = "none" });
    
    modal.addEventListener("click", e => {
	    let evTarget = e.target;
	    if(evTarget.classList.contains("modal-overlay")) {
	        modal.style.display = "none"
	    }
    })
    
    document.getElementById("updatebtn").remove();
    //답변 history 불러오기
    ajaxGet(contextPath+"/answer/" + el.id, getAnswers);

    modalContent.insertAdjacentHTML("beforeend", "<div class='modal-footer' id='answer-div'><div class='mb-3'>" +
		"<label for='answer' class='col-form-label'>답변 등록</label>" +
		"<textarea id='answer' class='form-control'></textarea>" +
		"<button type='button' class='btn btn-success btn-sm' id='answerbtn' onclick='registerAnswer()'>등록</button></div></div>");
}

function getAnswers(data){
	let modalContent = document.querySelector(".modal-body");
	modalContent.insertAdjacentHTML("beforeend", "<ul class='list-group' id='answer-ul'></ul>");
	let answerUl = document.getElementById("answer-ul");
	let resultHTML = "";
	data.list.forEach((el) => {
		if (el.writer == 'USER'){
			resultHTML += "<li class='list-group-item list-group-item-success'><div>"+el.writer+": "+el.content+"</div><div id='answerCreatedate'>작성일:"+ el.createDate.slice(0, 10) +"</div><button type='button' id='answerupdatebtn' class='btn btn-secondary btn-sm' onclick='answerUpdate("+el.id+")'>수정</button></li>"
		}else {
			resultHTML += "<li class='list-group-item'><div>" + el.writer +": " + el.content + "</div><div id='answerCreatedate'>작성일:"+ el.createDate.slice(0, 10) +"</div><button type='button' id='answerupdatebtn' class='btn btn-secondary btn-sm' onclick='answerUpdate(" + el.id + ")'>수정</button></li>"
		}
	});
	answerUl.innerHTML = resultHTML;
}

function getInqueryDetail(data){
	let url = contextPath+"/inquerydetail/" + data;
	ajaxGet(url, setInqueryDetail);
}
// 문의사항 답변 등록
function registerAnswer(){
	let inqueryid = document.getElementById('id').value;
	let data = JSON.stringify({
		inqueryId: inqueryid,
		content: document.getElementById('answer').value,
		writer: "ADMIN",
		status: 'normal'
	})
	ajaxPost(contextPath+"/answer", data, true, contextPath+"/answer/" + inqueryid, getAnswers);
	document.getElementById('answer').value=""
}
// 문의사항 답변 수정
function answerUpdate(aid){
	let data = JSON.stringify({
	id: aid,
	content: document.getElementById('answer').value
	})
	let inqueryid = document.getElementById('id').value;
	ajaxPost(contextPath+"/answer", data, contextPath+"/answer/" + inqueryid, getAnswers);
}

// 문의사항 답변 삭제
// function deleteAnswer(){
// 	let data = JSON.stringify({
//
// 	})
// 	ajaxPost(contextPath+"/answer", data);
// 	ajaxGet(contextPath+"/answer/" + el.id, getAnswers);
// }

// 회원 목록 불러오기
function getUsers(data){
	let menuname = document.querySelector("#menu-name")
	menuname.innerText = "회원 관리";

	let printSection = document.querySelector("#print-section");
	printSection.innerHTML = "<div class='row row-cols-1 row-cols-md-3 g-4' id='memberlist'></div>";
	let memberlist = document.getElementById('memberlist');
	let template = document.querySelector("#member-template").innerHTML;
	let resultHTML = "";
	console.log(data.list);
	data.list.forEach(el =>
		resultHTML += template.replace("{user_login_id}", el.user_login_id).replace("{username}", el.username)
						.replace("{email}", el.email).replace("{role}", el.role)
						.replace("{createTime}", el.create_time).replace("{modifyDate}", el.modify_date)
	);
	
	memberlist.innerHTML = resultHTML;
}
// 회원 권한 관리

// 회원 삭제

// ClassicEditor
// 	.create( document.querySelector('#content'))
// 	.then( editor => {
// 		console.log( editor );
// 	} )
// 	.catch( error => {
// 		console.error( error );
// 	} );
