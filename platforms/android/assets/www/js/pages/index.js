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
            current_pickup: {},
            current_delivery: {}
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
        }, showPickupModal: function(pickup){
            this.operations.current_pickup= pickup;
            $('#pickup_action_modal').modal('show');
        }, showDeliveryModal: function(delivery){
            this.operations.current_delivery= delivery;
            $('#delivery_action_modal').modal('show');
        }
    },
    filters: {
        formatMoney: function (value) {
            return accounting.formatMoney(value);
        },
        formatNumber: function (value) {
            return accounting.formatNumber(value);
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
        accounting.settings = {
            currency: {
                symbol : "$",   // default currency symbol is '$'
                format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
                decimal : ",",  // decimal point separator
                thousand: ".",  // thousands separator
                precision : 2   // decimal places
            },
            number: {
                precision : 0,  // default precision on numbers is 0
                thousand: ".",
                decimal : ","
            }
        };

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
    //$('.synchronize_data_operations').trigger("click");

    $(document).ready(function(){
        $('.takePhoto').click(function(event){
            event.preventDefault();
            var current_element= $(this);
            var button= $(this);
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.NATIVE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                targetHeight: 700,
                targetWidth: 700,
            });

            function onSuccess(imageURI) {
                var image = current_element.closest('form').find('.photo_of_camera');
                image.attr('src', imageURI);
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
        });

        $('.selectPhoto').click(function(event){
            event.preventDefault();
            var current_element= $(this);
            var button= $(this);
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.NATIVE_URI,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                targetHeight: 700,
                targetWidth: 700,
            });

            function onSuccess(imageURI) {
                var image = current_element.closest('form').find('.photo_of_camera');
                image.attr('src', imageURI);
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
        });
    });
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
    var text= prompt('Texto a imprimir');
    window.DatecsPrinter.printText(text, 'ISO-8859-1');
    window.DatecsPrinter.feedPaper(1);

    /*window.DatecsPrinter.printBarcode(
        69, //here goes the barcode type code
        text, //your barcode data
        function() {},
        function() {alert(JSON.stringify(error));}
    );
    window.DatecsPrinter.feedPaper(1);*/
}