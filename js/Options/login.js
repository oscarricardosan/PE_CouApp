$(document).ready(function(){
    $('#formLogin').submitWithValidator( function (event, form) {
        form.loading();
        event.preventDefault();
        var email= $('#username').val()+$('#user_email_domain').val();
        Login.login(
            email, $('#userpassword').val(),
            {
                success: function(response){
                    UserModel.store(response, {
                        success: function(){ window.location.href= 'index.html';}
                    });
                    alert(response.message);
                },failure: function(jqXHR, textStatus){
                    form.unloading();
                }

            }
        );
    })
});