var App= new Vue({
    el: '#App',
    data: {
        user: {
            name:'',
            email:'',
        },
        operations: {
            deliveries: [],
            pickups: [],
        },
        bluetooth_devices: [],
        printer_device: null
    },
    methods: {
        synchronize_data_operations: function(e) {
            var element= $(e.target);
            element.loading();
            Operations.synchronize_data_operations({
                success: function(){element.unloading();},
                fail: function(){ element.unloading(); }
            });
        }
    },
    watch: {
        printer_device: function(device){
            window.DatecsPrinter.connect(device.address,
                function() {},
                function() {
                    alert(JSON.stringify(error));
                }
            );
        }
    },
    mounted: function(){
        App_= this;
        UserModel.loaded(function(){
            var user= UserModel.get();
            if(user !== null){
                App_.user.email= user.user_data.email;
                App_.user.name= user.user_data.name;
            }
        });

        DeliveriesModel.loaded(function(){
            App_.operations.deliveries= DeliveriesModel.get();
        });

        PickupModel.loaded(function(){
            App_.operations.pickups= PickupModel.get();
        });
    }
});

$(document).ready(function(){
    $('.synchronize_data_operations').trigger("click");
});




/** Ready on mobiles **/
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    window.DatecsPrinter.listBluetoothDevices(
        function (devices) {
            App.bluetooth_devices= devices;
        },
        function (error) {
            alert(JSON.stringify(error));
        }
    );

};



function printText() {

    window.DatecsPrinter.feedPaper(1);
    window.DatecsPrinter.selectPageMode(function(){}, function(){});
    window.DatecsPrinter.feedPaper(1);

    var text= prompt('Texto a imprimir');
    window.DatecsPrinter.printText('{center}--------________-----', 'ISO-8859-1');
    window.DatecsPrinter.feedPaper(1);
    window.DatecsPrinter.printText(text, 'UTF-8');
    window.DatecsPrinter.feedPaper(1);

    /*window.DatecsPrinter.printBarcode(
        69, //here goes the barcode type code
        text, //your barcode data
        function() {},
        function() {alert(JSON.stringify(error));}
    );
    window.DatecsPrinter.feedPaper(1);*/
}