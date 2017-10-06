
UserModel.loaded(function(){
    if(!UserModel.is_user_logged())
        window.location.href = 'login.html';
});

