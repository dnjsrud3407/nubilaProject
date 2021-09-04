var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

$(function() {
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });
});

// 아이디 체크하기(정규표현식, 중복체크)
function checkId() {
    var user_login_id = $('#user_login_id').val();
    var regexId = /^[a-zA-Z0-9_-]{5,20}$/;

    // 정규식 조건을 통과한 경우
    if(regexId.test(user_login_id)) {
        $.ajax({
            url:'/user/idCheck',
            type:'post',
            data:{user_login_id:user_login_id},
            success:function(cnt){
                if(cnt < 1) {
                    $('.id_ok').css("display", "inline-block");
                    $('.id_already').css("display", "none");
                    $('#idCheck').val('checked');
                } else {
                    $('.id_ok').css("display", "none");
                    $('.id_already').css("display", "inline-block");
                    $('#idCheck').val('');
                }
            }
        });
        $('.id_invalid').css("display", "none");
    } else {
        $('#idCheck').val('');
        $('.id_ok').css("display", "none");
        $('.id_already').css("display", "none");
        $('.id_invalid').css("display", "inline-block");
    }
}

// 비밀번호 체크하기(정규표현식, 비밀번호 확인과 동일한지 체크)
function checkPw() {
    var password = $('#password').val();
    var regexPw = /^[a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]{8,20}$/;

    // 정규식 조건을 통과한 경우
    if(regexPw.test(password)) {
        $('.pw_ok').css("display", "inline-block");
        $('.pw_invalid').css("display", "none");
        $('#pwCheck').val('checked');
    } else {
        $('.pw_ok').css("display", "none");
        $('.pw_invalid').css("display", "inline-block");
        $('#pwCheck').val('');
    }

    checkPwConfirm();
}

// 비밀번호 체크하기(비밀번호 확인과 동일한지 체크)
function checkPwConfirm() {
    var password = $('#password').val();
    var password_confirm = $('#password_confirm').val();

    // 동일한 경우
    if(password_confirm != '' && password == password_confirm) {
        $('.pw_confirm_ok').css("display", "inline-block");
        $('.pw_confirm_invalid').css("display", "none");
        $('#pwConfirmCheck').val('checked');
    } else {
        $('.pw_confirm_ok').css("display", "none");
        $('.pw_confirm_invalid').css("display", "inline-block");
        $('#pwConfirmCheck').val('');
    }
}

// 이름 체크하기(정규표현식)
function checkName() {
    var username = $('#username').val();
    var regexName = /^[가-힣a-zA-Z]{2,10}$/;

    // 정규식 조건을 통과한 경우
    if(regexName.test(username)) {
        $('.name_ok').css("display", "inline-block");
        $('.name_invalid').css("display", "none");
        $('#nameCheck').val('checked');
    } else {
        $('.name_ok').css("display", "none");
        $('.name_invalid').css("display", "inline-block");
        $('#nameCheck').val('');
    }
}

// 이메일 체크하기(정규표현식, 중복체크)
function checkEmail() {
    var email = $('#email').val();
    var regexEmail = /[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    // 정규식 조건을 통과한 경우
    if(regexEmail.test(email)) {
        $.ajax({
            url:'/user/emailCheck',
            type:'post',
            data:{email:email},
            success:function(cnt){
                if(cnt < 1) {
                    $('.email_ok').css("display", "inline-block");
                    $('.email_already').css("display", "none");
                    $('#emailCheck').val('checked');
                } else {
                    $('.email_ok').css("display", "none");
                    $('.email_already').css("display", "inline-block");
                    $('#emailCheck').val('');
                }
            }
        });
        $('.email_invalid').css("display", "none");
    } else {
        $('#emailCheck').val('');
        $('.email_ok').css("display", "none");
        $('.email_already').css("display", "none");
        $('.email_invalid').css("display", "inline-block");
    }
}

// form Submit 전 최종 체크
function validation() {
    var idCheck = $('#idCheck').val();
    var pwCheck = $('#pwCheck').val();
    var pwConfirmCheck = $('#pwConfirmCheck').val();
    var nameCheck = $('#nameCheck').val();
    var emailCheck = $('#emailCheck').val();

    var result = true;
    if(idCheck != 'checked') {
        checkId();
        $('#user_login_id').focus();
        result = false;
    }

    if(pwCheck != 'checked') {
        checkPw();
        $('#password').focus();
        result = false;
    }

    if(pwConfirmCheck != 'checked') {
        checkPwConfirm();
        $('#password_confirm').focus();
        result = false;
    }

    if(nameCheck != 'checked') {
       checkName();
        $('#username').focus();
        result = false;
    }

    if(emailCheck != 'checked') {
       checkEmail();
        $('#email').focus();
        result = false;
    }

    return result;
}