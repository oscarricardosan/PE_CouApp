

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
        var first_execution= true;

        //Override the back button on Android to go to background instead of closing the app.
        cordova.plugins.backgroundMode.overrideBackButton();
        //active background process
        cordova.plugins.backgroundMode.enable();

        cordova.plugins.backgroundMode.setDefaults({
            title: 'Courier App',
            text: 'Me estoy ejecutando',
            //icon: 'icon',  this will look for icon.png in platforms/android/res/drawable|mipmap
            color: '#b3b3ff', // hex format like 'F14F4D'
            resume: true,
            hidden: false,
            bigText: false
        });

        cordova.plugins.backgroundMode.disableWebViewOptimizations();

        var index_executionBack= 0;
        function BackgroundProcessFunction(){
            navigator.notification.vibrate([1000]);
            index_executionBack++;
            cordova.plugins.backgroundMode.configure({
                text:
                "ENtrada "+index_executionBack+"\n"+
                "Primer ejecución "+(first_execution?'si':'no')
            });
            first_execution= false;
        }

        var index_executionFor= 0;
        function ForeGroundProcessFunction(){
            navigator.notification.beep(2);
            index_executionFor++;
            ToastrUtility_.success(
                "ENtrada "+index_executionFor+"\n"+
                "Primer ejecución "+(first_execution?'si':'no')
            )
        }

        var backgroundProcessTimer= undefined;
        var foreGroundProcessTimer= undefined;

        cordova.plugins.backgroundMode.on('activate', function() {
            if(typeof(foreGroundProcessTimer) !== 'undefined')clearInterval(foreGroundProcessTimer);
            backgroundProcessTimer= setInterval(function(){ BackgroundProcessFunction() }, 5000);
        });

        cordova.plugins.backgroundMode.on('deactivate', function() {
            if(typeof(backgroundProcessTimer) !== 'undefined')clearInterval(backgroundProcessTimer);
            foreGroundProcessTimer = setInterval(function(){ ForeGroundProcessFunction() }, 5000);
        });

        cordova.plugins.backgroundMode.enable();


        /** CLOSE BACKGROUND PROCESS**/
    }

    $(document).bind("mobileinit", function(){
        $.mobile.allowCrossDomainPages = true;
    });

    initializePage();
}