$(document).ready(function(){
    $('#formLogin').submitWithValidator( function (event, form) {
        form.loading();
        event.preventDefault();
        var email= $('#username').val()+$('#user_email_domain').val();
        Login.login(email, $('#userpassword').val(), {
            success: function(response){
                alert(JSON.stringify(response));
                form.unloading();
            },failure: function(jqXHR, textStatus){
                callback.failure();
                form.unloading();
            }
        });
    })
});