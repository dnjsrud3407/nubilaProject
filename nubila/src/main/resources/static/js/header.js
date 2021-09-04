// 축소 화면에서 nav 버튼 클릭시 메뉴 토글
const toggleBtn = document.querySelector(".nav-toggle-btn");
const menu = document.querySelector(".nav-menu");
toggleBtn.addEventListener('click', ()=>{
    menu.classList.toggle('active');
});