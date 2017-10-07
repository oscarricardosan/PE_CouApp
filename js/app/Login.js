var Login= (function () {

    /**
     * @param email string
     * @param password string
     * @param callback json
     */
    var login= function(email, password, callback){
        var request = $.ajax({
            url: Settings.route_api_pasar("login"),
            type: 'post',
            dataType: "json",
            data: {
                email_usr: email,
                password: password
            }
        });
        request.done(function(response){
            callback.success(response);
        });
        request.fail(function(jqXHR, textStatus) {
            callback.failure(jqXHR, textStatus);
            AjaxUtility_.processFaillRequest(jqXHR, textStatus);
        });
    };

    var is_logged_in= function (callback) {
        UserModel.loaded(function(){
            callback(!UserModel.isEmpty(), UserModel.get())
        });
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            login        : login,
            is_logged_in : is_logged_in,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
