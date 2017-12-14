function initializeApp(){

    SettingsModel.get({
        success: function(tx, results) {
            if(results._number_rows === 0){
                do{
                    var domain= prompt("Ingresa el dominio de tu empresa, ejemplo: demo.savne.net");
                    domain= domain===null?'':domain;
                    domain= $.trim(domain.toLowerCase());
                    var domain_data= _.findWhere(CustomerSettings, {domain: domain});
                    if(domain_data === undefined){
                        alert('Lo sentimos el dominio "'+domain+'" no esta registrado en nuestro sistema');
                    }
                }while(domain_data === undefined);
                SettingsModel.insert(domain_data, {
                    success: function(){
                        load_settings();
                    }
                });
            }else{
                load_settings();
            }
        }
    });

    function load_settings() {
        SettingsModel.get({
            success: function(tx, results) {
                Settings.setSettings(results._first);
                $('#user_email_domain option').val('@' + results._first.domain);
                $('#user_email_domain option').text('@' + results._first.domain);
                verify_login();
            }
        });
    }

    function verify_login(){
        Login.is_logged_in(function(success, user){
            if(success){
                alert(("Bienvenido "+user.name));
                window.location.href= 'index.html';
            }else{
                LogModel.clearTable();
            }
        });
    }



    $('#formLogin').submitWithValidator( function (event, form) {
        form.loading();
        event.preventDefault();
        var email= $.trim($('#username').val().toLowerCase())+$('#user_email_domain').val();

        Login.login(email, $('#userpassword').val(), {
            success: function(response){
                var user= {
                    id: response.id,
                    success: response.success,
                    token_mobile: response.token_mobile,
                    message: response.message,
                    email: response.user_data.email,
                    name: response.user_data.name,
                    token_generated_at: response.token_generated_at,
                };
                UserModel.insert(user, {
                    success: function(){ window.location.href= 'index.html';}
                });
                alert(response.message);
            },failure: function(jqXHR, textStatus){
                form.unloading();
            }

        });
    });

    $('.clearSettingsModel').click( function (event) {
        event.preventDefault();
        SettingsModel.clearTable({
            success: function(){
                window.location.reload();
            }
        });
    });

};

