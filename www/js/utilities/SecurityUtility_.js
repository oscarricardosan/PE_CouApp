try{
var SecurityUtility_= (function () {
    var user;
    var token_to_server= 'RGDK:@)QCbgcjjlfoNT&M7,(|Js8gS';

    var add_token_to_server= function(data){
        data.token= token_to_server;
        return data;
    };

    var add_user_authenticated= function(data){
        var current_position= {latitude: null, longitude: null};
        if(typeof(App) === "object"){
            if(typeof(App.current_position) === "object"){
                if(App.current_position.latitude !== undefined && App.current_position.longitude !== undefined){
                    current_position= App.current_position;
                }
            }
        }

        data= add_token_to_server(data);
        data.user= {email: user.email, token_mobile: user.token_mobile, current_position: current_position};
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