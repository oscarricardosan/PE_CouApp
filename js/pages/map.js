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
    },
    methods: {
    },
    filters: {
    },
    watch: {
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

        /**
         * Create map
         */
        map = L.map('addressMap').setView([0, 0], 14);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        DeliveriesModel.loaded(function(){
            App_.operations.deliveries= DeliveriesModel.get();

            /**
             * Add deliveries in Map
             */
            $.each(App_.operations.deliveries, function(index, delivery){
                new L.marker().setLatLng({
                    lng: delivery.longitude,
                    lat: delivery.latitude
                }).addTo(map).bindPopup(
                    "<div style='text-align:center;'>Entrega</div>"+
                    "<i class='fa fa-user'></i>"+delivery.courier.email+" - <b>"+delivery.delivery_number+"</b><br>"+
                    "<b>Dirección: </b> "+delivery.address+" <br>"+
                    "<b>Observaciones dirección: </b> "+delivery.long_address+"<br>"+
                    "<i class='fa fa-clock-o'></i>"+delivery.delivery_start_time+" y "+delivery.delivery_end_time+" <br>"
                )
            });
        });

        PickupModel.loaded(function(){
            App_.operations.pickups= PickupModel.get();

            /**
             * Add deliveries in Map
             */
            $.each(App_.operations.pickups, function(index, pickup){
                new L.marker().setLatLng({
                    lng: pickup.longitude,
                    lat: pickup.latitude
                }).addTo(map).bindPopup(
                    "<div style='text-align:center;'>Recolección</div>"+
                    "<i class='fa fa-user'></i>"+pickup.courier.email+" - <b>"+pickup.pickup_number+"</b><br>"+
                    "<b>Dirección: </b> "+pickup.address+" <br>"+
                    "<b>Observaciones dirección: </b> "+pickup.long_address+"<br>"+
                    "<i class='fa fa-clock-o'></i>"+pickup.pickup_start_time+" y "+pickup.pickup_end_time+" <br>"
                )
            });
        });

        /*new L.marker().setLatLng({
            lng: {{ $delivery->longitude }},
        lat: {{ $delivery->latitude }}
    }).addTo(map).bindPopup(
            "<i class='fa fa-user'></i>{{ $delivery->courier->email }} - <b>{{ $delivery->delivery_number }}</b><br>"+
            "<b>Dirección: </b> {{ $delivery->address }} <br>"+
            "<b>Observaciones dirección: </b> {{ $delivery->long_address }}<br>"+
            "<i class='fa fa-clock-o'></i>{{ $delivery->delivery_start_time }} y {{ $delivery->delivery_end_time }} <br>"+
            "<button class='btn btn-block btn-link markerInMap' "+
            " target='#DeliveryMarker_{{$delivery->id}}' "+
            ">"+
            "   <i class='fa fa-external-link'></i> Ver detalles"+
            "</button>"
        );*/
    }
});

$(document).ready(function(){
    //$('.synchronize_data_operations').trigger("click");
});


