$(document).ready(function(){

    SettingsModel.loaded(function () {
        var settings= SettingsModel.get();
        if(settings === null){
            do{
                var domain= prompt("Ingresa el dominio de tu empresa, ejemplo: demo.savne.net");
                domain= domain.toLowerCase();
                var domain_data= _.findWhere(CustomerSettings, {domain: domain});
                if(domain_data === undefined){
                    alert('Lo sentimos el dominio "'+domain+'" no esta registrado en nuestro sistema');
                }
            }while(domain_data === undefined);
            SettingsModel.store(domain_data);
            settings= SettingsModel.get();
        }

        if(settings !== null && settings !== undefined) {
            Settings.setSettings(settings);
            $('#user_email_domain option').val('@' + settings.domain);
            $('#user_email_domain option').text('@' + settings.domain);

            Login.is_logged_in(function(success, user){
                if(success){
                    ToastrUtility_.success("Bienvenido "+user.user_data.name);
                    window.location.href= 'index.html';
                }
            });
        }
    });



    $('#formLogin').submitWithValidator( function (event, form) {
        form.loading();
        event.preventDefault();
        var email= $('#username').val().toLowerCase()+$('#user_email_domain').val();

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

    $('.clearSettingsModel').click( function (event) {
        event.preventDefault();
        SettingsModel.drop(function(){
            window.location.reload();
        });
    });

});
