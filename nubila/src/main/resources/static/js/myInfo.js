var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

$(function() {
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });
});

function password_change() {
    $('.password_change_div').css("display", "block");
    $('.password_change_btn').css("display", "none");
}
function email_change() {
    $('.email_change_div').css("display", "block");
    $('.email_change_btn').css("display", "none");
}
function password_cancel() {
    $('.password_change_btn').css("display", "inline-block");
    $('.password_change_div').css("display", "none");
    $('.pw_confirm_invalid').css("display", "none");
    document.getElementById("confirm_password").value = '';
}
function email_cancel() {
    $('.email_change_btn').css("display", "inline-block");
    $('.email_change_div').css("display", "none");
    $('.email_confirm_invalid').css("display", "none");
    document.getElementById("confirm_email").value = '';
}

// 비밀번호 일치 확인
function password_validate() {
    var confirm_password = $('#confirm_password').val();

    $('.pw_confirm_invalid').css("display", "none");

    $.ajax({
        url:'/myInfo/pwConfirm',
        type:'post',
        data:{confirm_password:confirm_password},
        success:function(cnt){
            if(cnt < 1) {
                changeForm.method = "get";
                changeForm.action = "/myInfo/pwChange";
                changeForm.submit();
            } else {
                $('.pw_confirm_invalid').css("display", "block");
            }
        }
    });
}

// 이메일 일치 확인
function email_validate() {
    var confirm_email = $('#confirm_email').val();

    $('.email_confirm_invalid').css("display", "none");

    $.ajax({
        url:'/myInfo/emailConfirm',
        type:'post',
        data:{confirm_email:confirm_email},
        success:function(cnt){
            if(cnt < 1) {
                changeForm.method = "get";
                changeForm.action = "/myInfo/emailChange";
                changeForm.submit();
            } else {
                $('.email_confirm_invalid').css("display", "block");
            }
        }
    });
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
function validation_myInfoEmailChangeForm() {
    var emailCheck = $('#emailCheck').val();

    var result = true;
    if(emailCheck != 'checked') {
       checkEmail();
        $('#email').focus();
        result = false;
    }

    return result;
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
function validation_myInfoPwChangeForm() {
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

function validation_deleteInfo() {
    if(!$("input:checked[id='deleteCheck']").is(":checked")) {
        alert('탈퇴 안내를 확인하고 동의해 주세요.');
        return false;
    }

    location.href = '/myInfo/pwConfirm';
    return true;
}

// 비밀번호 일치 확인
// 회원 삭제
function password_validate_pwConfirm() {
    var confirm_password = $('#confirm_password').val();

    $('.pw_confirm_invalid').css("display", "none");

    $.ajax({
        url:'/myInfo/pwConfirm',
        type:'post',
        data:{confirm_password:confirm_password},
        success:function(cnt){
            if(cnt < 1) {
                changeForm.method = "get";
                changeForm.action = "/myInfo/pwConfirmAndDelete";
                changeForm.submit();
            } else {
                $('.pw_confirm_invalid').css("display", "inline-block");
            }
        }
    });
}