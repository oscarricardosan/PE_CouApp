var Login= (function () {

    /**
     * @param email string
     * @param password string
     * @param callback json
     */
    var login= function(email, password, callback){
        UserModel.clearTable({success: function() {
            var request = $.ajax({
                url: Settings.route_api_pasar("login"),
                type: 'post',
                dataType: "json",
                data: SecurityUtility_.add_token_to_server({
                    email: email,
                    password: password
                })
            });
            request.done(function (response) {
                response.token_generated_at = MomentUtility_.numericDate();
                if (response.success)
                    callback.success(response);
                else
                    callback.failure();
            });
            request.fail(function (jqXHR, textStatus) {
                callback.failure(jqXHR, textStatus);
                AjaxUtility_.processFailRequest(jqXHR, textStatus);
            });
        }});
    };

    var is_logged_in= function (callback) {
        UserModel.get({
            success: function(tx, results){
                var success= false;
                var user= {};
                if(results._number_rows===0){
                    success= false;
                }else{
                    user= results._first;
                    var nowadte= MomentUtility_.numericDate();
                    success= user.token_generated_at === nowadte;
                    if(!success)
                        UserModel.clearTable({success: function() {}});
                }
                callback(success, user)
            }
        });
    };

    var logout= function (callback) {
        callback= (callback===undefined)?function(){}:callback;
        DeliveriesModel.clearTable({success: function(){
            PickupModel.clearTable({success: function(){
                UserModel.clearTable({success: function(){
                    callback();
                }});
            }});
        }});
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            login        : login,
            is_logged_in : is_logged_in,
            logout       : logout
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
