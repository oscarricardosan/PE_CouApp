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
            destinationType: Camera.DestinationType.DATA_URL,
            targetHeight: 700,
            targetWidth: 700
        });

        function onSuccess(imageData) {
            dataUriImage= "data:image/jpeg;base64," + imageData;
            var image = button.prev('.photo');
            image.attr('src', dataUriImage);
            //$('#message').html(dataUriImage);
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    });
});