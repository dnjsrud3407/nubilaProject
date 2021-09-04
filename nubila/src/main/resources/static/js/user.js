// 아이디, 비밀번호 null 체크하기
function validation_login() {
    var user_login_id = $('#user_login_id').val();
    var password = $('#password').val();

    $('.id_invalid').css("display", "none");
    $('.pw_invalid').css("display", "none");
    $('.invalid_user').css("display", "none");

    if(user_login_id == "") {
        $('.id_invalid').css("display", "inline-block");
        return false;
    }
    else if(password == "") {
        $('.pw_invalid').css("display", "inline-block");
        return false;
    }

    return true;
}

// 이름, 이메일 null 체크하기
function validation_idSearchForm() {
    var username = $('#username').val();
    var email = $('#email').val();

    $('.name_invalid').css("display", "none");
    $('.email_invalid').css("display", "none");
    $('.invalid_user').css("display", "none");

    if(username == "") {
        $('.name_invalid').css("display", "inline-block");
        return false;
    }
    else if(email == "") {
        $('.email_invalid').css("display", "inline-block");
        return false;
    }

    return true;
}