var App;
function initializePage() {
    App = new Vue({
        el: '#App',
        data: {
            user: {
                name: '',
                email: '',
            },
            operations: {
                deliveries: [],
                pickups: [],
            },
            ajax_queue_count: 0,
        },
        methods: {
            synchronize_data_operations: function (e) {
                var element = $(e.target);
                element.loading();
                Operations.synchronize_data_operations({
                    success: function () {
                        element.unloading();
                    },
                    fail: function () {
                        element.unloading();
                    }
                });
            },
            check_ajax_queue: function(e) {
                var element= $(e.target);
                AjaxQueue.check_queue_from_element(element);
            }
        },
        filters: {},
        watch: {},
        mounted: function () {

            App_ = this;
            UserModel.loaded(function () {
                var user = UserModel.get();
                if (user !== null) {
                    App_.user.email = user.user_data.email;
                    App_.user.name = user.user_data.name;
                }
            });

            Ajax_queueModel.loaded(function(){
                App_.ajax_queue_count= Ajax_queueModel.get().length;
            });

            /**
             * Create map
             */
            var map = L.map('map').fitWorld();
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18
            }).addTo(map);
            map.locate({setView: true, maxZoom: 16});

            /** DETECTAR UBICACIÓN ACTUAL **/
            function onLocationFound(e) {
                var radius = e.accuracy / 2;

                L.marker(e.latlng).addTo(map)
                    .bindPopup("Tu estas en un radio de " + radius + " metros desde este punto").openPopup();

                L.circle(e.latlng, radius).addTo(map);
            }
            map.on('locationfound', onLocationFound);

            /** ERROR SI NO ENCUENTRA UBICACIÓN ACTUAL **/
            function onLocationError(e) {
                alert(e.message);
            }

            map.on('locationerror', onLocationError);


            /**
             * CARGA MARCAS
             */
            DeliveriesModel.loaded(function () {
                App_.operations.deliveries = DeliveriesModel.get();

                /**
                 * Add deliveries in Map
                 */
                $.each(App_.operations.deliveries, function (index, delivery) {

                    var icon = L.icon({
                        iconUrl: 'images/map_icons/delivery_' + delivery.delivery_state.class + '.png?1',
                        shadowUrl: 'images/map_icons/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        tooltipAnchor: [16, -28],
                        shadowSize: [41, 41]
                    });

                    new L.marker().setLatLng({
                        lng: delivery.longitude,
                        lat: delivery.latitude
                    }).setIcon(icon).addTo(map).bindPopup(
                        "<div style='text-align:center;'>Entrega <span class='label bg-" + delivery.delivery_state.class + "'>" + delivery.delivery_state.name + "</span></div>" +
                        "<i class='fa fa-user'></i>" + delivery.courier.email + " - <b>" + delivery.delivery_number + "</b><br>" +
                        "<b>Dirección: </b> " + delivery.address + " <br>" +
                        "<b>Observaciones dirección: </b> " + delivery.long_address + "<br>" +
                        "<i class='fa fa-clock-o'></i>" + delivery.delivery_start_time + " y " + delivery.delivery_end_time + " <br>"
                    )
                });
            });

            PickupModel.loaded(function () {
                App_.operations.pickups = PickupModel.get();

                /**
                 * Add deliveries in Map
                 */
                $.each(App_.operations.pickups, function (index, pickup) {

                    var icon = L.icon({
                        iconUrl: 'images/map_icons/pickup_' + pickup.pickup_state.class + '.png?1',
                        shadowUrl: 'images/map_icons/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        tooltipAnchor: [16, -28],
                        shadowSize: [41, 41]
                    });

                    new L.marker().setLatLng({
                        lng: pickup.longitude,
                        lat: pickup.latitude
                    }).setIcon(icon).addTo(map).bindPopup(
                        "<div style='text-align:center;'>Recolección <span class='label bg-" + pickup.pickup_state.class + "'>" + pickup.pickup_state.name + "</span></div>" +
                        "<i class='fa fa-user'></i>" + pickup.courier.email + " - <b>" + pickup.pickup_number + "</b><br>" +
                        "<b>Dirección: </b> " + pickup.address + " <br>" +
                        "<b>Observaciones dirección: </b> " + pickup.long_address + "<br>" +
                        "<i class='fa fa-clock-o'></i>" + pickup.pickup_start_time + " y " + pickup.pickup_end_time + " <br>"
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

    $(document).ready(function () {
        //$('.synchronize_data_operations').trigger("click");
    });

}