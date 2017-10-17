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

    try{
        /**
         * GPS
         */
        alert(JSON.stringify(backgroundGeolocation));
        alert(Settings.route_api_pasar('store_gps'));
        backgroundGeolocation.configure(callbackFn, failureFn, {
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            url: Settings.route_api_pasar('store_gps'),
            httpHeaders: { 'X-FOO': 'bar' },
            maxLocations: 1000,
            // Android only section
            locationProvider: backgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
            interval: 60000,
            fastestInterval: 5000,
            activitiesInterval: 10000,
            notificationTitle: 'Background tracking',
            notificationText: 'enabled',
            notificationIconColor: '#FEDD1E',
            notificationIconLarge: 'mappointer_large',
            notificationIconSmall: 'mappointer_small'
        });

        backgroundGeolocation.watchLocationMode(
            function (enabled) {
                if (enabled) {
                    // location service are now enabled
                    // call backgroundGeolocation.start
                    // only if user already has expressed intent to start service
                } else {
                    // location service are now disabled or we don't have permission
                    // time to change UI to reflect that
                }
            },
            function (error) {
                console.log('Error watching location mode. Error:' + error);
            }
        );

        backgroundGeolocation.isLocationEnabled(function (enabled) {
            if (enabled) {
                backgroundGeolocation.start(
                    function () {
                        // service started successfully
                        // you should adjust your app UI for example change switch element to indicate
                        // that service is running
                    },
                    function (error) {
                        // Tracking has not started because of error
                        // you should adjust your app UI for example change switch element to indicate
                        // that service is not running
                        if (error.code === 2) {
                            if (window.confirm('Not authorized for location updates. Would you like to open app settings?')) {
                                backgroundGeolocation.showAppSettings();
                            }
                        } else {
                            window.alert('Start failed: ' + error.message);
                        }
                    }
                );
            } else {
                // Location services are disabled
                if (window.confirm('Location is disabled. Would you like to open location settings?')) {
                    backgroundGeolocation.showLocationSettings();
                }
            }
        });
    }catch(e){
        alert(JSON.stringify(e));
    }


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

        /***
         * @Notificaciones cada 100 segundos, cambio en la barra de mensaje
         */
        var index_execution=0;
        setInterval(function () {
            index_execution++;
  /*          if(index_execution % 100 == 0) {
                navigator.notification.beep(2);
                navigator.notification.vibrate([1500, 500, 1500]);
            }
*/
            cordova.plugins.backgroundMode.configure({
                text:
                    "Recolecciones "+App.operations.deliveries.length+
                    "\nEntregas "+App.operations.pickups.length
                }
            );
        }, 5000);


    });

    /** CLOSE BACKGROUND PROCESS**/
}

$(document).bind("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
});