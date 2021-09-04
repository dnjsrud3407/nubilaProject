var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

$(function() {
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });
});

// 아이디, 이름, 이메일 null 체크하기
function confirm() {
    var user_login_id = $('#user_login_id').val();
    var username = $('#username').val();
    var email = $('#email').val();

    $('.id_invalid').css("display", "none");
    $('.name_invalid').css("display", "none");
    $('.email_invalid').css("display", "none");
    $('.invalid_user').css("display", "none");

    if(user_login_id == "") {
        $('.id_invalid').css("display", "inline-block");
        return false;
    }
    else if(username == "") {
        $('.name_invalid').css("display", "inline-block");
        return false;
    }
    else if(email == "") {
        $('.email_invalid').css("display", "inline-block");
        return false;
    }

    sendMail();
}

var mailString = "";
// 메일 보내기
function sendMail() {
    var user_login_id = $('#user_login_id').val();
    var username = $('#username').val();
    var email = $('#email').val();

    $.ajax({
        url:'/user/sendMail',
        type:'post',
        data:{user_login_id:user_login_id,
              username:username,
              email:email},
        success:function(result){
            if(result != '') {
                alert('이메일로 인증번호를 발송하였습니다.');
                $('.confirmString-div').css("display", "block");
                $('.confirmString_invalid').css("display", "none");
                $('.btn-next').css("display", "none");
                $('.btn-submit').css("display", "block");

                mailString = result;
            } else {
                $('.invalid_user').css("display", "inline-block");
            }
        }
    });
}
function validation_pwSearchForm() {
    var confirmString = $('#confirmString').val();

    $('.confirmString_invalid').css("display", "none");
    $('.confirmString_Confirm_invalid').css("display", "none");

    if(confirmString == "") {
        $('.confirmString_invalid').css("display", "inline-block");
        return false;
    }
    if(mailString != confirmString) {
        $('.confirmString_Confirm_invalid').css("display", "inline-block");
        return false;
    }
    return true;
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

// form Submit 전 최종 체크
function validation_pwChangeForm() {
    var pwCheck = $('#pwCheck').val();
    var pwConfirmCheck = $('#pwConfirmCheck').val();

    var result = true;
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

    return result;
}