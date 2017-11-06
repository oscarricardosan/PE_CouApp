var App;
function initializePage() {
    App = new Vue({
        el: '#App',
        data: {
            map: undefined,
            map_markers: [],
            user: {
                name: '',
                email: '',
            },
            operations: {
                deliveries: [],
                pickups: [],
            },
            deliveries_to_show: [],
            pickups_to_show: [],
            ajax_queue_count: 0,
            current_position: undefined,
            dates_to_filter: [],
            date_to_filter: undefined,
            ready: true
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
            },
            remove_markers_in_map: function(){
                var App_= this;
                $.each(App_.map_markers, function () {
                    App_.map.removeLayer(this);
                });
            },
            new_icon: function(iconUrl){
                return L.icon({
                    iconUrl: iconUrl,
                    shadowUrl:  'images/map_icons/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    tooltipAnchor: [16, -28],
                    shadowSize: [41, 41]
                });
            },
            distance_to_pickup: function (App, pickup){
                var App_= this;
                var distance= Haversine.distance_in_text(App_.current_position, pickup);
                if(distance.success){
                    if(pickup.distance_in_mts !== distance.distance_in_mts){
                        pickup.distance_in_mts= distance.distance_in_mts;
                        PickupModel.update({id: pickup.id}, pickup, {
                            success: function(){
                                App_.operations.pickups= PickupModel.get();
                            }
                        });
                    }
                }
                return distance.message;
            },
            distance_to_delivery: function (App, delivery){
                var App_= this;
                var distance= Haversine.distance_in_text(App_.current_position, delivery);
                if(distance.success){
                    if(delivery.distance_in_mts !== distance.distance_in_mts){
                        delivery.distance_in_mts= distance.distance_in_mts;
                        DeliveriesModel.update({id: delivery.id}, delivery, {
                            success: function(){
                                App_.operations.deliveries= DeliveriesModel.get();
                            }
                        });
                    }
                }
                return distance.message;
            },
            centerLeafletMapOnMarker: function (marker) {
                var latLngs = [ marker.getLatLng() ];
                var markerBounds = L.latLngBounds(latLngs);
                App_.map.fitBounds(markerBounds);
            }
        },
        filters: { },
        watch: {
            operations: {
                handler(val){
                    App_= this;
                    var url_params= UrlUtility_.getParams();
                    var pickup_dates= _(App.operations.pickups).chain().groupBy('pickup_date').keys().value();
                    var delivery_dates= _(App.operations.deliveries).chain().groupBy('delivery_date').keys().value();
                    this.dates_to_filter= _.sortBy(_.union(pickup_dates, delivery_dates));
                    if(this.date_to_filter === undefined && this.dates_to_filter.length > 0){
                        if(url_params.show_pickup_id !== undefined){
                            PickupModel.loaded(function(){
                                App_.date_to_filter= PickupModel.find({id: url_params.show_pickup_id*1})[0].pickup_date;
                            });
                        }else if(url_params.show_delivery_id !== undefined){
                            DeliveriesModel.loaded(function(){
                                App_.date_to_filter= DeliveriesModel.find({id: url_params.show_delivery_id*1})[0].delivery_date;
                            });
                        }else{
                            App_.date_to_filter= this.dates_to_filter[0];
                        }
                    }
                },
                deep: true
            },
            date_to_filter: function(date){
                var App_= this;
                this.remove_markers_in_map();
                this.deliveries_to_show= _.where(App_.operations.deliveries, {delivery_date: date});
                this.pickups_to_show= _.where(App_.operations.pickups, {pickup_date: date});
            },
            pickups_to_show: function(pickups){
                var App_= this;
                var url_params= UrlUtility_.getParams();
                $.each(pickups, function (index, pickup) {
                    var icon = App_.new_icon('images/map_icons/pickup_' + pickup.pickup_state.class + '.png?1');

                    var marker= new L.marker().setLatLng({
                        lng: pickup.longitude,
                        lat: pickup.latitude
                    }).setIcon(icon).addTo(App_.map).bindPopup(
                        "<div style='text-align:center;'>Recolección <span class='label bg-" + pickup.pickup_state.class + "'>" + pickup.pickup_state.name + "</span></div>" +
                        "<i class='fa fa-user'></i>" + pickup.courier.email + " - <b>" + pickup.pickup_number + "</b><br>" +
                        "<b>Dirección: </b> " + pickup.address + " <br>" +
                        "<b>Observaciones dirección: </b> " + pickup.long_address + "<br>" +
                        "<i class='fa fa-clock-o'></i>" + pickup.pickup_start_time + " y " + pickup.pickup_end_time + " <br>"+
                        "<i class='fa fa-globe'></i> A "+Haversine.mtrs_to_text(pickup.distance_in_mts)+"  <br>"+
                        "<a class='btn btn-primary btn-block' style='color: white!important;' href='index.html?filter_date="+pickup.pickup_date+"&search="+pickup.pickup_number+"&tab=tab_pickups'> <i class='fa fa-external-link'></i> Ver </a><br>"
                    );
                    if(url_params.show_pickup_id !== undefined && url_params.show_pickup_id == pickup.id)
                        marker.openPopup();
                    App_.map_markers.push(marker);
                    if(url_params.show_pickup_id !== undefined && url_params.show_pickup_id == pickup.id)
                        App_.centerLeafletMapOnMarker(marker);
                });
            },
            deliveries_to_show:function(deliveries){
                var App_= this;
                var url_params= UrlUtility_.getParams();
                $.each(deliveries, function (index, delivery) {
                    var icon = App_.new_icon('images/map_icons/delivery_' + delivery.delivery_state.class + '.png?1');

                    var marker= new L.marker().setLatLng({
                        lng: delivery.longitude,
                        lat: delivery.latitude
                    }).setIcon(icon).addTo(App_.map).bindPopup(
                        "<div style='text-align:center;'>Entrega <span class='label bg-" + delivery.delivery_state.class + "'>" + delivery.delivery_state.name + "</span></div>" +
                        "<i class='fa fa-user'></i>" + delivery.courier.email + " - <b>" + delivery.delivery_number + "</b><br>" +
                        "<b>Dirección: </b> " + delivery.address + " <br>" +
                        "<b>Observaciones dirección: </b> " + delivery.long_address + "<br>" +
                        "<i class='fa fa-clock-o'></i>" + delivery.delivery_start_time + " y " + delivery.delivery_end_time + " <br>"+
                        "<i class='fa fa-globe'></i> A "+Haversine.mtrs_to_text(delivery.distance_in_mts)+"  <br>"+
                        "<a class='btn btn-primary btn-block' style='color: white!important;' href='index.html?filter_date="+delivery.delivery_date+"&search="+delivery.delivery_number+"&tab=tab_deliveries'> <i class='fa fa-external-link'></i> Ver </a><br>"
                    );
                    if(url_params.show_delivery_id !== undefined && url_params.show_delivery_id == delivery.id)
                        marker.openPopup();
                    App_.map_markers.push(marker);
                    if(url_params.show_delivery_id !== undefined && url_params.show_delivery_id == delivery.id)
                        App_.centerLeafletMapOnMarker(marker);
                });
            },
            current_position: function(current_position){
                App_.map.locate({maxZoom: 12});
            }
        },
        mounted: function () {
            App_ = this;
            var url_params= UrlUtility_.getParams();

            /**
             * Create map
             */
            App_.map = L.map('map').fitWorld();
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18
            }).addTo(App_.map);
            App_.map.locate({setView: true, maxZoom: 12});

            /** DETECTAR UBICACIÓN ACTUAL **/
            function onLocationFound(e) {
                var radius = e.accuracy / 2;
                if(url_params.show_pickup_id !== undefined ||  url_params.show_delivery_id !== undefined){
                    L.marker(e.latlng).addTo(App_.map)
                        .bindPopup("Tu estas en un radio de " + radius + " metros desde este punto");
                }else{
                    L.marker(e.latlng).addTo(App_.map)
                        .bindPopup("Tu estas en un radio de " + radius + " metros desde este punto")
                        .openPopup();
                }
                L.circle(e.latlng, radius).addTo(App_.map);
            }
            function onLocationError(e) {
                alert(e.message);
            }
            App_.map.on('locationfound', onLocationFound);
            App_.map.on('locationerror', onLocationError);

            GpsModel.loaded(function () {
                App_.current_position= GpsModel.get();
            });
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
             * CARGA MARCAS
             */
            DeliveriesModel.loaded(function () {
                App_.operations.deliveries = DeliveriesModel.get();
                PickupModel.loaded(function () {
                    App_.operations.pickups = PickupModel.get();
                });
            });


        }
    });

    $(document).ready(function () {
        //$('.synchronize_data_operations').trigger("click");
    });

}