var Login= (function () {

    /**
     * @param user string
     * @param password string
     */
    var login= function(email, password, callback){
        var request = $.ajax({
            url: Settings.route_api_pasar("login"),
            type: 'post',
            dataType: "json",
            data: {
                email: email,
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

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            login    : login,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
