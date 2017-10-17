var SecurityUtility_= (function () {

    var token_to_server= 'RGDK:@)QCbgcjjlfoNT&M7,(|Js8gS';

    var add_token_to_server= function(data){
        data.token= token_to_server;
        return data;
    };

    var add_user_authenticated= function(data){
        var user= UserModel.get();
        data= add_token_to_server(data);
        data.user= {email: user.user_data.email, token_mobile: user.token_mobile};
        return data;
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            add_user_authenticated      : add_user_authenticated,
            add_token_to_server         : add_token_to_server
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
