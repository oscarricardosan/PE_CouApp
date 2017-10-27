

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
        var backgroundProcessTimer= undefined;
        var foreGroundProcessTimer= undefined;

        window.open = cordova.InAppBrowser.open;

        /** BACKGROUND PROCESS**/
        //Override the back button on Android to go to background instead of closing the app.
        cordova.plugins.backgroundMode.overrideBackButton();
        //active background process
        cordova.plugins.backgroundMode.enable();
        cordova.plugins.backgroundMode.disableWebViewOptimizations();

        cordova.plugins.backgroundMode.setDefaults({
            title: 'Courier App',
            text: 'Bienvenido',
            //icon: 'icon',  this will look for icon.png in platforms/android/res/drawable|mipmap
            color: '#b3b3ff', // hex format like 'F14F4D'
            resume: true,
            hidden: false,
            bigText: false
        });

        cordova.plugins.backgroundMode.on('activate', function() {
            cordova.plugins.backgroundMode.configure({text: 'Background activado'});
            ProcessBackground.reload_bar_message(function () {ProcessBackground.run();});
            if(typeof(foreGroundProcessTimer) !== 'undefined')clearInterval(foreGroundProcessTimer);
            backgroundProcessTimer= setInterval(function(){ ProcessBackground.run() }, 5000);
        });

        cordova.plugins.backgroundMode.on('deactivate', function() {
            if(typeof(backgroundProcessTimer) !== 'undefined')clearInterval(backgroundProcessTimer);
            foreGroundProcessTimer = setInterval(function(){ ProcessForeground.run() }, 5000);
        });
        foreGroundProcessTimer = setInterval(function(){ ProcessForeground.run() }, 5000);

        /** CLOSE BACKGROUND PROCESS**/
    }

    $(document).bind("mobileinit", function(){
        $.mobile.allowCrossDomainPages = true;
    });

    initializePage();
}
//initializePage();