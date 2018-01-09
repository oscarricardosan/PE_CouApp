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
            current_position_marker: undefined,
            current_position_circle: undefined,
            dates_to_filter: [],
            date_to_filter: undefined,
            ready: true,
            can_refresh_position: false
        },
        methods: {
            synchronize_data_operations: function (e) {
                var element= $(e.target);
                element.loading();
                App.ready= false;
                Operations.synchronize_data_operations({
                    success: function(){element.unloading(); App.ready= true; alert('Sincronización finalizada');},
                    fail: function(){ element.unloading(); App.ready= true; alert('Error al sincronizar');}
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
            centerLeafletMapOnMarker: function (marker) {
                var latLngs = [ marker.getLatLng() ];
                var markerBounds = L.latLngBounds(latLngs);
                App_.map.fitBounds(markerBounds);
            },
        },
        filters: {
            mtrs_to_text: function (mts) {
                return Haversine.mtrs_to_text(mts);
            }
        },
        watch: {
            "operations.deliveries": function(newVal, oldVal){
                var App_= this;
                var pickup_dates= _(App_.operations.pickups).chain().groupBy('date').keys().value();
                var delivery_dates= _(App_.operations.deliveries).chain().groupBy('date').keys().value();
                this.dates_to_filter= _.sortBy(_.union(pickup_dates, delivery_dates));
                if(this.date_to_filter === undefined && this.dates_to_filter.length > 0)
                    this.date_to_filter= this.dates_to_filter[0];
            },
            "operations.pickups": function(newVal, oldVal){
                var App_= this;
                var pickup_dates= _(App_.operations.pickups).chain().groupBy('date').keys().value();
                var delivery_dates= _(App_.operations.deliveries).chain().groupBy('date').keys().value();
                this.dates_to_filter= _.sortBy(_.union(pickup_dates, delivery_dates));
                if(this.date_to_filter === undefined && this.dates_to_filter.length > 0)
                    this.date_to_filter= this.dates_to_filter[0];
            },
            date_to_filter: function(date){
                var App_= this;
                this.remove_markers_in_map();
                this.deliveries_to_show= _.where(App_.operations.deliveries, {date: date});
                this.pickups_to_show= _.where(App_.operations.pickups, {date: date});
            },
            pickups_to_show: function(pickups){
                var App_= this;
                var url_params= UrlUtility_.getParams();
                $.each(pickups, function (index, pickup) {
                    if(pickup.long !== null && pickup.lat !== null) {
                        var icon = App_.new_icon('images/map_icons/pickup_'+Settings.pickup_state[pickup.state_id].class+'.png?1');

                        var marker = new L.marker().setLatLng({
                            lng: pickup.long,
                            lat: pickup.lat
                        }).setIcon(icon).addTo(App_.map).bindPopup(
                            "<div style='text-align:center;'>Recolección <span class='label bg-"+Settings.pickup_state[pickup.state_id].class+"'>"+Settings.pickup_state[pickup.state_id].name+"</span></div>" +
                            "<b>" + pickup.number + "</b><br>" +
                            "<b>Dirección: </b> " + pickup.address + " <br>" +
                            "<b>Observaciones dirección: </b> " + pickup.long_address + "<br>" +
                            "<i class='fa fa-clock-o'></i>" + pickup.start_time + " y " + pickup.end_time + " <br>" +
                            "<i class='fa fa-globe'></i> A " + Haversine.mtrs_to_text(pickup.distance_in_mts) + "  <br>" +
                            "<a class='btn btn-primary btn-block' style='color: white!important;' href='index.html?filter_date=" + pickup.date + "&search=" + pickup.number + "&tab=tab_pickups'> <i class='fa fa-external-link'></i> Ver </a><br>" +
                            "<a class='a-popup-close-button btn btn-danger btn-block' style='color: white!important;' href='#close'> <i class='fa fa-times'></i> Ocultar </a><br>"
                        );
                        if (url_params.show_pickup_id !== undefined && url_params.show_pickup_id == pickup.id)
                            marker.openPopup();
                        App_.map_markers.push(marker);
                        if (url_params.show_pickup_id !== undefined && url_params.show_pickup_id == pickup.id)
                            App_.centerLeafletMapOnMarker(marker);
                    }
                });
            },
            deliveries_to_show:function(deliveries){
                var App_= this;
                var url_params= UrlUtility_.getParams();
                $.each(deliveries, function (index, delivery) {
                    if(delivery.long !== null && delivery.lat !== null){
                        var icon = App_.new_icon('images/map_icons/delivery_'+Settings.delivery_state[delivery.state_id].class+'.png?1');

                        var marker= new L.marker().setLatLng({
                            lng: delivery.long,
                            lat: delivery.lat
                        }).setIcon(icon).addTo(App_.map).bindPopup(
                            "<div style='text-align:center;'>Entrega <span class='label bg-"+Settings.delivery_state[delivery.state_id].class+"'>"+Settings.delivery_state[delivery.state_id].name+"</span></div>" +
                            "<b>" + delivery.number + "</b><br>" +
                            "<b>Dirección: </b> " + delivery.address + " <br>" +
                            "<b>Observaciones dirección: </b> " + delivery.long_address + "<br>" +
                            "<i class='fa fa-clock-o'></i>" + delivery.start_time + " y " + delivery.end_time + " <br>"+
                            "<i class='fa fa-globe'></i> A "+Haversine.mtrs_to_text(delivery.distance_in_mts)+"  <br>"+
                            "<a class='btn btn-primary btn-block' style='color: white!important;' href='index.html?filter_date="+delivery.date+"&search="+delivery.number+"&tab=tab_deliveries'> <i class='fa fa-external-link'></i> Ver </a><br>"+
                            "<a class='a-popup-close-button btn btn-danger btn-block' style='color: white!important;' href='#close'> <i class='fa fa-times'></i> Ocultar </a><br>"
                        );
                        if(url_params.show_delivery_id !== undefined && url_params.show_delivery_id == delivery.id)
                            marker.openPopup();
                        App_.map_markers.push(marker);
                        if(url_params.show_delivery_id !== undefined && url_params.show_delivery_id == delivery.id)
                            App_.centerLeafletMapOnMarker(marker);
                    }
                });
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
            App_.map.locate({setView: true, maxZoom: 14});

            /** DETECTAR UBICACIÓN ACTUAL **/
            App_.map.on('locationfound', onLocationFound);
            App_.map.on('locationerror', onLocationError);

            GpsModel.get({success: function(tx, results){
                App_.current_position= results._first;
            }});
            UserModel.get({success: function(tx, results){
                App_.user.name= results._first.name;
                App_.user.email= results._first.email;
            }});
            Ajax_queueModel.countRaw("", {success:function(tx, results) {
                App_.ajax_queue_count= results._count;
            }});


            /**
             * CARGA MARCAS
             */
            DeliveriesModel.get({success: function (tx, results) {
                App_.operations.deliveries = results._all;
                PickupsModel.get({success: function (tx, results) {
                    App_.operations.pickups = results._all;
                }});
            }});


        }
    });

    $(document).ready(function () {
        //$('.synchronize_data_operations').trigger("click");
        $(document).on('click', '.a-popup-close-button', function(){
            App.map.closePopup();
        });
    });

    /** DETECTAR UBICACIÓN ACTUAL **/
    function onLocationFound(e) {
        if(App_.current_position_marker !== undefined)
            App_.map.removeLayer(App_.current_position_marker);
        if(App_.current_position_circle !== undefined)
            App_.map.removeLayer(App_.current_position_circle);

        var radius = e.accuracy / 2;
        App_.current_position_marker= L.marker(e.latlng).addTo(App_.map)
            .bindPopup("Tu estas en un radio de " + radius + " metros desde este punto");
        App_.current_position_circle= L.circle(e.latlng, radius).addTo(App_.map);
        setTimeout(function(){ App_.can_refresh_position= true; }, 1000);

    }
    function onLocationError(e) {
        ToastrUtility_.error(e.message);
    }

}