var MomentUtility_= (function () {

    var numericDate= function (){
        return  moment().year()+''+moment().month()+''+moment().date();
    };

    var now= function (){
        var real_month= moment().month()+1;
        var month= real_month<10? '0'+real_month:real_month;
        var date= moment().date()<10? '0'+moment().date():moment().date();
        var hour= moment().hour()<10?'0'+moment().hour()*1:moment().hour();
        var minute= moment().minute()<10?'0'+moment().minute()*1:moment().minute();
        var seconds= moment().seconds()<10?'0'+moment().seconds()*1:moment().seconds();
        return  moment().year()+'-'+month+'-'+date+' '+hour+':'+minute+':'+seconds;
    };

    var current_date= function (){
        var real_month= moment().month()+1;
        var month= real_month<10? '0'+real_month:real_month;
        var date= moment().date()<10? '0'+moment().date():moment().date();
        return  moment().year()+'-'+month+'-'+date;
    };

    var current_time= function (){
        var hour= moment().hour()<10?'0'+moment().hour()*1:moment().hour();
        var minute= moment().minute()<10?'0'+moment().minute()*1:moment().minute();
        var seconds= moment().seconds()<10?'0'+moment().seconds()*1:moment().seconds();
        return  hour+':'+minute+':'+seconds;
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            numericDate           : numericDate,
            current_date          : current_date,
            current_time          : current_time,
            now                   : now,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
