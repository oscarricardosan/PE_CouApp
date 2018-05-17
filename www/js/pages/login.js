function initializeApp(){

    function intializeSettings(){
        SettingsModel.get({
            success: function(tx, results) {
                if(results._number_rows === 0){
                    var domain= prompt("Ingresa el dominio de tu empresa, ejemplo: demo.savne.net");
                    domain= domain===null?'':domain;
                    domain= $.trim(domain.toLowerCase());

                    if(domain === ''){
                        alert('Debes ingresar un dominio.')
                        intializeSettings();
                        return false;
                    }
                    $('#formLogin').loading();
                    var request = $.ajax({
                        url: 'https://courier-app.savne.net/mobile_api/get_customer_setup',
                        type: 'post',
                        dataType: "json",
                        data: SecurityUtility_.add_token_to_server({domain: domain})
                    });
                    request.done(function (response) {
                        $('#formLogin').unloading();
                        if(response.success){
                            Exception_to_pickupModel.clearTable( { success: function(){
                                Exception_to_deliveryModel.clearTable( { success: function(){
                                    Exception_to_visitModel.clearTable( { success: function(){
                                        Exception_to_visitModel.insert_multiple( response.setup_data.exceptions.to_visits, { success: function(){
                                            Exception_to_deliveryModel.insert_multiple( response.setup_data.exceptions.to_deliveries, { success: function(){
                                                Exception_to_pickupModel.insert_multiple( response.setup_data.exceptions.to_pickups, { success: function(){
                                                    SettingsModel.insert({
                                                        domain: response.setup_data.domain, url_server: response.setup_data.url_server
                                                    }, {success: function(){
                                                        load_settings();
                                                    }});
                                                }});
                                            }});
                                        }});
                                    }});
                                }});
                            }});
                        }else{
                            alert(response.message)
                            intializeSettings();
                        }
                    });
                    request.fail(function (jqXHR, textStatus) {
                        AjaxUtility_.processFailRequest(jqXHR, textStatus);
                        $('#formLogin').unloading();
                        intializeSettings();
                    });
                }else{
                    load_settings();
                }
            }
        });
    }

    intializeSettings();

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
                    success: function(){
                        SettingsModel.clearTable({
                            success: function(){
                                SettingsModel.insert({
                                    domain: response.setup_data.domain, url_server: response.setup_data.url_server
                                }, {success: function(){
                                    load_settings();
                                    window.location.href= 'index.html';
                                }});
                            }
                        });
                    }
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

