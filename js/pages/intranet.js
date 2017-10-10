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
    var index_execution= 0;
    window.open = cordova.InAppBrowser.open;

    /** BACKGROUND PROCESS**/
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
            cordova.plugins.notification.badge.increase();
            cordova.plugins.backgroundMode.configure({text: 'Execución '+index_execution });
            index_execution++;
        }, 1000);
    });

    cordova.plugins.backgroundMode.on('deactivate', function () {
        cordova.plugins.notification.badge.clear();
    });

}

$(document).bind("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
});