var location_available= false;
var bluetooth_available= false;

var Permissions = cordova.plugins.permissions;


var list = [
    permissions.BLUETOOTH,
    permissions.ACCESS_COARSE_LOCATION,
    permissions.ACCESS_FINE_LOCATION
];

Permissions.hasPermission(list, success, error);

function error() {
    alert('GPS y Bluetooth deben estar activados.');
    window.location.reload();
}

function success( status ) {
    if (!status.hasPermission) {
        permissions.requestPermissions(
            list,
            function (status) {
                if (!status.hasPermission) error();
            },
            error);
    }else{
        initializeIntranet();
    }
}

/** Ready on mobiles **/
document.addEventListener("deviceready", onDeviceReadyIntranet, false);
function onDeviceReadyIntranet() {
    check_hardware();
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

            /***
             * @Notificaciones cada 100 segundos, cambio en la barra de mensaje
             */
            var index_execution=0;
            setInterval(function () {
                /*          if(index_execution % 100 == 0) {
                              navigator.notification.beep(2);
                              navigator.notification.vibrate([1500, 500, 1500]);
                          }
              */
                cordova.plugins.backgroundMode.configure({
                    text:
                    "ENtrada "+index_execution
                });
            }, 5000);


        });

        /** CLOSE BACKGROUND PROCESS**/
    }

    $(document).bind("mobileinit", function(){
        $.mobile.allowCrossDomainPages = true;
    });

    initializePage();
}