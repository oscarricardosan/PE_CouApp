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
            data: SecurityUtility_.add_token_to_server({
                email: email,
                password: password
            })
        });
        request.done(function(response){
            response.token_generated_at= MomentUtility_.numericDate();
            callback.success(response);
        });
        request.fail(function(jqXHR, textStatus) {
            callback.failure(jqXHR, textStatus);
            AjaxUtility_.processFaillRequest(jqXHR, textStatus);
        });
    };

    var is_logged_in= function (callback) {
        UserModel.loaded(function(){
            var user= UserModel.get();
            var nowadte= MomentUtility_.numericDate();
            var success= false;
            if(!UserModel.isEmpty() && user.token_generated_at == nowadte)
                success= true;
            callback(success, user)
        });
    }

    var logout= function (callback) {
        db.drop(function(){
            window.location.href= 'login.html';
        });
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            login        : login,
            is_logged_in : is_logged_in,
            logout       : logout,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
