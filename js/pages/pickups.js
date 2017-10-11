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
        current_pickup: {}
    },
    methods: {
        synchronize_data_operations: function(e) {
            var element= $(e.target);
            element.loading();
            Operations.synchronize_data_operations({
                success: function(){element.unloading();},
                fail: function(){ element.unloading(); }
            });
        },
        showModal: function(pickup){
            this.current_pickup= pickup;
            $('#pickupModal').modal('show');
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
    $('.takePhoto').click(function(event){
        event.preventDefault();
        var button= $(this);
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.NATIVE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            targetHeight: 700,
            targetWidth: 700,
        });

        function onSuccess(imageURI) {
            var image = $('.photo_of_camera');
            image.attr('src', imageURI);
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    });

    $('.selectPhoto').click(function(event){
        event.preventDefault();
        var button= $(this);
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.NATIVE_URI,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            targetHeight: 700,
            targetWidth: 700,
        });

        function onSuccess(imageURI) {
            var image = $('.photo_of_camera');
            image.attr('src', imageURI);
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    });

    $('#scan_barcode').click(function(event){
        cloudSky.zBar.scan({
            text_title: "OPTIONAL Title Text - default = 'Scan QR Code'", // Android only
            text_instructions: "OPTIONAL Instruction Text - default = 'Please point your camera at the QR code.'", // Android only
            camera: "back", // defaults to "back"
            flash: "auto", // defaults to "auto". See Quirks
            drawSight: true //defaults to true, create a red sight/line in the center of the scanner view.
        }, function(code){alert(code);},
            function(error){alert(error)}

        );
    });
});
