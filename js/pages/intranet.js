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
        setInterval(function () {


            var location= '';
            function onSuccess(position) {
                location=
                    "\n-------------------------------"+
                    "\nUbicación: \n"+
                    '___Latitud: ' + position.coords.latitude + "\n"+
                    '___Longitud: ' + position.coords.longitude;
            }
            function onError(error) {
                location=
                    "\n -------------------------------"+
                    "\nUbicación: \n"+
                    "\n___Error en ubicación: "+error.message+'.'
                );
            }
            var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {
                timeout: 7000,
                enableHighAccuracy: true
            });








            cordova.plugins.backgroundMode.configure({
                text:
                    "Recolecciones pendientes 5 de  "+index_execution+
                    "\nEntregas pendientes 1 de  "+index_execution+
                    location
                }
            );
            index_execution++;
            if(index_execution % 20 == 0) {
                navigator.notification.beep(2);
                navigator.notification.vibrate([1500, 500, 1500]);
            }




        }, 1000);
    });

    cordova.plugins.backgroundMode.on('deactivate', function () {
        cordova.plugins.notification.badge.clear();
    });
    /** CLOSE BACKGROUND PROCESS**/
}

$(document).bind("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
});