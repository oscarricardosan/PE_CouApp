var App= new Vue({
    el: '#App',
    data: {
        user: {
            name:'',
            email:'',
        }
    }, mounted: function(){
        UserModel.loaded(function(){
            var user= UserModel.get();
            App.user.email= user.user_data.email;
            App.user.name= user.user_data.name;
        });
    }
});



/** Ready on mobiles **/
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    window.open = cordova.InAppBrowser.open;
}

$(document).bind("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
});