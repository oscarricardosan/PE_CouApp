
/** Ready on mobiles **/
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    window.open = cordova.InAppBrowser.open;
}

$(document).bind("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
});