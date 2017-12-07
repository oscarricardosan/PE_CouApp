try{
var SecurityUtility_= (function () {
    var user;
    var token_to_server= 'RGDK:@)QCbgcjjlfoNT&M7,(|Js8gS';

    var add_token_to_server= function(data){
        data.token= token_to_server;
        return data;
    };

    var add_user_authenticated= function(data){
        data= add_token_to_server(data);
        data.user= {email: user.email, token_mobile: user.token_mobile};
        return data;
    };

    function load_user_data(){
        UserModel.get({success:function(tx, results){
            user= results._first;
        }});
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            add_user_authenticated      : add_user_authenticated,
            add_token_to_server         : add_token_to_server,
            load_user_data              : load_user_data
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();
}catch(e){ alert('Security: '+e.message);
}