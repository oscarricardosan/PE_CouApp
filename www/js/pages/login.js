$(document).ready(function(){
    Login.is_logged_in(function(success, user){
        try{
        if(success){
            ToastrUtility_.success("Bienvenido "+user.user_data.name);
            window.location.href= 'index.html';
        }
        }catch (e){ alert(JSON.stringify(e));}
    });


    $('#formLogin').submitWithValidator( function (event, form) {
        form.loading();
        event.preventDefault();
        var email= $('#username').val()+$('#user_email_domain').val();

        callback= {
            success: function(response){
                UserModel.store(response, {
                    success: function(){ window.location.href= 'index.html';}
                });
                alert(response.message);
            },failure: function(jqXHR, textStatus){
                form.unloading();
            }

        };
        Login.login(email, $('#userpassword').val(), callback);
    });


});