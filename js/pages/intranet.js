$(document).ready(function(){
    Login.is_logged_in(function(success, user){
        if(!success){
            alert('Debes iniciar sesión para continuar');
            window.location.href= 'login.html';
        }
    });


    $('.logout').click(function(event){
        event.preventDefault();
        Login.logout();
    });
});



/** Ready on mobiles **/
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    window.open = cordova.InAppBrowser.open;


    /** BACKGROUND PROCESS**/
    var index_execution= 0;
    cordova.plugins.backgroundMode.enable();
    cordova.plugins.backgroundMode.disableWebViewOptimizations();
    cordova.plugins.backgroundMode.overrideBackButton();

    cordova.plugins.backgroundMode.setDefaults({
        title: 'Courier App',
        text: 'Me estoy ejecutando',
        //icon: 'icon',  this will look for icon.png in platforms/android/res/drawable|mipmap
        color: '#b3b3ff', // hex format like 'F14F4D'
        resume: true,
        hidden: false,
        bigText: false
    });

    cordova.plugins.backgroundMode.on('activate', function () {
        var index_execution=0;
        setInterval(function () {
            var location= '';
            function onSuccess(position) {
                location=
                    "\n-------------------------------"+
                    "\nUbicación: "+
                    '\n___Latitud: ' + position.coords.latitude +
                    '\n___Longitud: ' + position.coords.longitude;


                cordova.plugins.backgroundMode.configure({
                        text:
                        "Recolecciones pendientes 5 de  "+index_execution+
                        "\nEntregas pendientes 1 de  "+index_execution+
                        location
                    }
                );
            }
            function onError(error) {
                location=
                    "\n -------------------------------"+
                    "\nUbicación: "+
                    "\n___Error en ubicación: "+error.message+'.';


                cordova.plugins.backgroundMode.configure({
                        text:
                        "Recolecciones pendientes 5 de  "+index_execution+
                        "\nEntregas pendientes 1 de  "+index_execution+
                        location
                    }
                );
            }
            var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {
                timeout: 5000,
                enableHighAccuracy: true
            });
        }, 10000);

        setInterval(function () {
            index_execution++;
            if(index_execution % 20 == 0) {
                navigator.notification.beep(2);
                navigator.notification.vibrate([1500, 500, 1500]);
            }

            cordova.plugins.backgroundMode.configure({
                text:
                    "Recolecciones pendientes 5 de  "+index_execution+
                    "\nEntregas pendientes 1 de  "+index_execution
                }
            );
        }, 1000);
    });

    /** CLOSE BACKGROUND PROCESS**/
}

$(document).bind("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
});