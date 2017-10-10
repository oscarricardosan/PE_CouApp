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
            cordova.plugins.backgroundMode.configure({
                text:
                    "Recolecciones pendientes 5 de  "+index_execution+
                    "Entregas pendientes 1 de  "+index_execution
                }
            );
            index_execution++;
            if(index_execution % 20 == 0) {
                navigator.notification.beep(2);

                function alertDismissed() {/* do something*/}
                navigator.notification.alert(
                    'Recolección programada',  // message
                    alertDismissed,         // callback
                    'Mensaje ',            // title
                    'Entendido y aceptado'                  // buttonName
                );
                navigator.notification.vibrate(2500);

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