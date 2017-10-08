var SecurityUtility_= (function () {

    var get_auth= function(){
        var user= UserModel.get();
        return {email: user.user_data.email, token_mobile: user.token_mobile};
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            get_auth       : get_auth,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
