

//initializeIntranet();
/** Ready on mobiles **/
document.addEventListener("deviceready", onDeviceReadyIntranet, false);
function onDeviceReadyIntranet() {
    Check_hardware.diagnostic_in_intranet();
}

function initializeIntranet(){
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
        var first_execution= true;
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
            index_execution++;
            if(first_execution){
                navigator.notification.beep(2);
                /***
                 * @Notificaciones cada 100 segundos, cambio en la barra de mensaje
                 */
                setInterval(function () {
                    /*          if(index_execution % 100 == 0) {
                                  navigator.notification.beep(2);
                                  navigator.notification.vibrate([1500, 500, 1500]);
                              }
                  */
                    cordova.plugins.backgroundMode.configure({
                        text:
                        "ENtrada "+index_execution+"\n"+
                        "Primer ejecución "+(first_execution?'si':'no')
                    });
                }, 100);

                first_execution= false;
            }

        });

        /** CLOSE BACKGROUND PROCESS**/
    }

    $(document).bind("mobileinit", function(){
        $.mobile.allowCrossDomainPages = true;
    });

    initializePage();
}