var App;
function initializePage(){
    App= new Vue({
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
            printer_device: null,
            current_photo: 'images/camera.png',
            transmit_delivery_photos_only_wifi: false,
            transmit_pickup_photos_only_wifi: false,
            ajax_queue_count: 0,
            settings_current_printer: null,
            settings_current_printer_code: null,
            dates_to_filter: [],
            date_to_filter: undefined,
            number_search: '',
            pickups_in_list: 0,
            deliveries_in_list: 0,
            current_position: undefined,
            ready: true,
            pickups_sorted: [],
            deliveries_sorted: [],
            visible_states: {},
            exceptions_to_pickup: [],
            exceptions_to_delivery: [],
        },
        methods: {
            synchronize_data_operations: function(e) {
                var element= $(e.target);
                element.loading();
                App.ready= false;
                Operations.synchronize_data_operations({
                    success: function(){element.unloading(); App.ready= true; alert('Sincronización finalizada');},
                    fail: function(){ element.unloading(); App.ready= true; alert('Error al sincronizar');}
                });
            }, showPickupModal: function(pickup){
                this.operations.current_delivery= {};
                this.operations.current_pickup= pickup;
                $('#pickup_action_modal').modal('show');
            }, showDeliveryModal: function(delivery){
                this.operations.current_pickup= {};
                this.operations.current_delivery= delivery;
                $('#delivery_action_modal').modal('show');
            },
            check_ajax_queue: function(e) {
                var element= $(e.target);
                AjaxQueue.check_queue_from_element(element);
            },
            contains: function(search, value) {
                try{
                    if(typeof value === 'object')
                        value= JSON.stringify(value);
                    return value.toUpperCase().indexOf(search.toUpperCase()) >= 0;
                }catch(e){
                    alert('contains: '+e.message);
                }
            },
            refresh_counters_in_list: function(){
                try{
                    var refresh= function(){
                        var pickups= $('.list-group.pickups>.pickup').length;
                        var deliveries= $('.list-group.deliveries>.delivery').length;
                        App.pickups_in_list= pickups;
                        App.deliveries_in_list= deliveries;

                        if(deliveries === 0 && pickups>0) $('[href="#tab_pickups"]').click();
                        if(pickups === 0 && deliveries>0) $('[href="#tab_deliveries"]').click();

                        $(document).scroll();
                    };

                    setTimeout(refresh, 220);
                    setTimeout(refresh, 500);
                }catch (e){
                    alert('date_to_filter: '+e.message);
                }
            },
            set_number_search: function(search){
                this.number_search= search;
            },
            reload_lists: function(){
                var App_=this;
                this.pickups_sorted= _(this.operations.pickups).chain()
                    .where({date: App_.date_to_filter})
                    .sortBy('distance_in_mts')
                    //.reverse()
                    .value();

                this.deliveries_sorted= _(this.operations.deliveries).chain()
                    .where({date: App_.date_to_filter})
                    .sortBy('distance_in_mts')
                    //.reverse()
                    .value();

                this.pickups_in_list= this.pickups_sorted.length;
                this.deliveries_in_list= this.deliveries_sorted.length;

                if(this.deliveries_in_list === 0 && this.pickups_in_list>0) $('[href="#tab_pickups"]').click();
                if(this.pickups_in_list === 0 && this.deliveries_in_list>0) $('[href="#tab_deliveries"]').click();

                setTimeout(function(){ $(document).scroll(); }, 100);
                setTimeout(function(){ $(document).scroll(); }, 220);
            }
        },
        filters: {
            formatMoney: function (value) {
                return accounting.formatMoney(value);
            },
            formatNumber: function (value) {
                return accounting.formatNumber(value);
            },
            mtrs_to_text: function (mts) {
                return Haversine.mtrs_to_text(mts);
            }
        },
        computed: {
            percentage_of_collected: function(){
                var App_= this;
                var collected= _.where(App_.operations.pickups, {state_id: 200}).length;
                return accounting.formatNumber(
                    (collected * 100) / App_.operations.pickups.length, 2, ',', '.'
                );
            },
            percentage_of_collected_exception: function(){
                var App_= this;
                var collected= _.where(App_.operations.pickups, {state_id: 300}).length;
                return accounting.formatNumber(
                    (collected * 100) / App_.operations.pickups.length, 2, ',', '.'
                );
            },
            percentage_not_collected: function(){
                var App_= this;
                var collected= _.where(App_.operations.pickups, {state_id: 200}).length;
                var exceptions= _.where(App_.operations.pickups, {state_id: 300}).length;
                var not_collected= App_.operations.pickups.length - (collected+exceptions);
                return accounting.formatNumber(
                    (not_collected* 100) / App_.operations.pickups.length, 2, ',', '.'
                );
            },

            percentage_of_delivered: function(){
                var App_= this;
                var delivered= _.where(App_.operations.deliveries, {state_id: 200}).length;
                return accounting.formatNumber(
                    (delivered * 100) / App_.operations.deliveries.length, 2, ',', '.'
                );
            },
            percentage_of_delivered_exception: function(){
                var App_= this;
                var exceptions= _.where(App_.operations.deliveries, {state_id: 300}).length;
                return accounting.formatNumber(
                    (exceptions * 100) / App_.operations.deliveries.length, 2, ',', '.'
                );
            },
            percentage_not_delivered: function(){
                var App_= this;
                var delivered= _.where(App_.operations.deliveries, {state_id: 200}).length;
                var exceptions= _.where(App_.operations.deliveries, {state_id: 300}).length;
                var not_delivered= App_.operations.deliveries.length - (delivered+exceptions);
                return accounting.formatNumber(
                    (not_delivered* 100) / App_.operations.deliveries.length, 2, ',', '.'
                );
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

                var url_params= UrlUtility_.getParams();
                if((url_params.filter_date !== undefined && url_params.filter_date !== '') && url_params.tab === 'tab_deliveries'){
                    this.date_to_filter= url_params.filter_date;
                    UrlUtility_.setParam('filter_date', '');
                }

                this.reload_lists();
                this.refresh_counters_in_list();
            },
            "operations.pickups": function(newVal, oldVal){
                var App_= this;
                var pickup_dates= _(App_.operations.pickups).chain().groupBy('date').keys().value();
                var delivery_dates= _(App_.operations.deliveries).chain().groupBy('date').keys().value();
                this.dates_to_filter= _.sortBy(_.union(pickup_dates, delivery_dates));
                if(this.date_to_filter === undefined && this.dates_to_filter.length > 0)
                    this.date_to_filter= this.dates_to_filter[0];

                var url_params= UrlUtility_.getParams();
                if((url_params.filter_date !== undefined && url_params.filter_date !== '') && url_params.tab === 'tab_pickups'){
                    this.date_to_filter= url_params.filter_date;
                    UrlUtility_.setParam('filter_date', '');
                }

                this.reload_lists();
                this.refresh_counters_in_list();
            },
            date_to_filter: function(){
                try{
                    this.reload_lists();
                    this.refresh_counters_in_list();
                }catch (e){
                    alert('date_to_filter: '+e.message);
                }
            },
            number_search: function(){
                this.refresh_counters_in_list();
            },

            transmit_delivery_photos_only_wifi: function(newVal, oldVal){
                SettingsModel.update({id: 1}, {transmit_delivery_photos_only_wifi: newVal});
            },
            transmit_pickup_photos_only_wifi: function(newVal, oldVal){
                SettingsModel.update({id: 1}, {transmit_pickup_photos_only_wifi: newVal});
            }
        },
        mounted: function(){
            try{
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

                var url_params= UrlUtility_.getParams();
                var App_= this;

                UserModel.get({success: function(tx, results){
                    App_.user.name= results._first.name;
                    App_.user.email= results._first.email;
                }});
                DeliveriesModel.get({success: function(tx, results){
                    App_.operations.deliveries= results._all;
                }});
                PickupModel.get({success: function(tx, results){
                    App_.operations.pickups= results._all;
                }});
                Ajax_queueModel.countRaw("", {success:function(tx, results) {
                    App_.ajax_queue_count= results._count;
                }});
                PrinterModel.get({success: function(tx, results){
                    if(results._number_rows === 1) {
                        App_.settings_current_printer = results._first.address;
                        App_.settings_current_printer_code = results._first.code;
                    }
                }});
                GpsModel.get({success: function(tx, results){
                    App_.current_position= results._first;
                }});
                SettingsModel.get({success: function(tx, results){
                    App_.transmit_delivery_photos_only_wifi= results._first.transmit_delivery_photos_only_wifi == 'true';
                    App_.transmit_pickup_photos_only_wifi= results._first.transmit_pickup_photos_only_wifi == 'true';
                }});

                Exception_to_pickupModel.get({success: function(tx, results){
                    App_.exceptions_to_pickup= results._all;
                }});
                Exception_to_deliveryModel.get({success: function(tx, results){
                    App_.exceptions_to_delivery= results._all;
                }});

                if(url_params.search !== undefined)
                    this.number_search= url_params.search;

            }catch (e){ alert(e.message); }
        }
    });

    $(document).ready(function(){
        var url_params= UrlUtility_.getParams();
        if(url_params.tab !== undefined){
            $('[href="#'+url_params.tab+'"]').click();
        }

        $('#scan_barcode_to_search').click(function(){
            cloudSky.zBar.scan({
                text_title: "Leer código de barras", // Android only
                text_instructions: "Por favor apuntar tu camara al código de barras", // Android only
            }, function(code){
                App.number_search= code;
            }, function(){});
        });

        $('.scan_barcode_update_consigment').click(function(){
            var button= $(this);
            cloudSky.zBar.scan({
                text_title: "Leer código de barras", // Android only
                text_instructions: "Por favor apuntar tu camara al código de barras", // Android only
            }, function(code){
                var guias= button.closest('form').find('[name="guias"]');
                if($.trim(guias.val()) != ''){
                    guias.val(guias.val()+"\n");
                }
                guias.val(guias.val()+code+"\n");
            }, function(){});
        });
        /**
         * OPEN PHOTOS
         */
        $('.takePhoto').click(function(event){
            event.preventDefault();
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.PNG,
                targetHeight: 700,
                targetWidth: 700,
            });

            function onSuccess(imageURI) {
                App.current_photo= "data:image/png;base64," + imageURI;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
        });

        $('.selectPhoto').click(function(event){
            event.preventDefault();
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                encodingType: Camera.EncodingType.PNG,
                targetHeight: 700,
                targetWidth: 700,
            });

            function onSuccess(imageURI) {
                App.current_photo= "data:image/png;base64," + imageURI;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
        });

        /**
         * CLOSE PHOTOS
         */


        /** ABRE STORE DE FOTOS */
        $('#delivery_attach_photo, #pickup_attach_photo').on('hidden.bs.modal', function () {
            App.current_photo= 'images/camera.png';
            $(this).find('[name]').val('');
        });
        $('.attach_photo_to_delivery').click(function(){
            if(App.current_photo === 'images/camera.png'){
                alert('Debes cargar una foto'); return false;
            }
            var form= $(this).closest('.modal');
            form.loading();
            var data= FormUtility_.serialized_data_to_json(form.find('form').serializeArray());
            data.data_uri_photo= App.current_photo;
            data.entrega_id= App.operations.current_delivery.id;
            setTimeout(function(){form.unloading();}, 3000);
            AjaxQueue.add({
                process_name: 'Adjunto foto delivery: ',
                type: 'post',
                url: 'delivery/attach_photo',
                dataType: 'json',
                data: data,
                transmit_only_with_WiFi: App.transmit_delivery_photos_only_wifi,
                success: function(response){
                    if(!cordova.plugins.backgroundMode.isActive()){
                        ToastrUtility_.success(response.message);
                        if(response.data.id == App.operations.current_delivery.id)
                            $('#delivery_attach_photo').modal('hide');
                    }
                    if(typeof form === 'object')form.unloading();
                },
                fail: function(_data){
                    if(!cordova.plugins.backgroundMode.isActive()){
                        ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                        if(_data.entrega_id == App.operations.current_delivery.id)
                            $('#delivery_attach_photo').modal('hide');
                    }
                    if(typeof form === 'object')form.unloading();
                }
            });
        });
        $('.attach_photo_to_pickup').click(function(){
            if(App.current_photo === 'images/camera.png'){
                alert('Debes cargar una foto'); return false;
            }
            var form= $(this).closest('.modal');
            form.loading();
            var data= FormUtility_.serialized_data_to_json(form.find('form').serializeArray());
            data.data_uri_photo= App.current_photo;
            data.recoleccion_id= App.operations.current_pickup.id;
            setTimeout(function(){form.unloading();}, 3000);
            AjaxQueue.add({
                process_name: 'Adjunto foto pickup: ',
                type: 'post',
                url: 'pickup/attach_photo',
                dataType: 'json',
                data: data,
                transmit_only_with_WiFi: App.transmit_pickup_photos_only_wifi,
                success: function(response){
                    if(!cordova.plugins.backgroundMode.isActive()){
                        ToastrUtility_.success(response.message);
                        if(response.data.id == App.operations.current_pickup.id)
                            $('#pickup_attach_photo').modal('hide');
                    }
                    if(typeof form === 'object')form.unloading();
                },
                fail: function(_data){
                    if(!cordova.plugins.backgroundMode.isActive()) {
                        ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                        if(_data.recoleccion_id == App.operations.current_pickup.id)
                            $('#pickup_attach_photo').modal('hide');
                    }
                    if(typeof form === 'object')form.unloading();
                }
            });
        });
        /** <!-- CIERRA STORE DE FOTOS */

        /** ABRE STORE DE EXCEPCIONES */
        $('#pickup_exception_modal, #delivery_exception_modal').on('show.bs.modal', function () {
            $(this).find('[name]').val('');
            $(this).find('[current_time]').val(
                MomentUtility_.current_time().substr(0,5)
            );
            $(this).find('[current_date]').val(MomentUtility_.current_date());
        });
        $('#pickup_exception_modal form').submit(function (event) {
            event.preventDefault();
            var form= $(this);
            form.loading();
            var data= FormUtility_.serialized_data_to_json(form.serializeArray());
            data.recoleccion_id= App.operations.current_pickup.id;
            AjaxQueue.add({
                process_name: 'Pickup guardar excepción: ',
                type: 'post',
                url: 'pickup/store_exception',
                dataType: 'json',
                data: data,
                success: function(response){
                    if(typeof form === 'object')form.unloading();
                    PickupModel.update({id: response.data.id}, response.data, {
                        success: function () {
                            App.operations.current_pickup = response.data;
                            PickupModel.get({success: function (tx, results) {
                                App.operations.pickups = results._all;
                            }});
                            if (!cordova.plugins.backgroundMode.isActive()) {
                                ToastrUtility_.success(response.message);
                                if(response.data.id == App.operations.current_pickup.id)
                                    $('#pickup_exception_modal').modal('hide');
                            }
                        }
                    });
                },
                fail: function(_data){
                    var new_vals= {state_id: 300, state: "Excepción"};
                    if(typeof form === 'object')form.unloading();
                    PickupModel.update({id: _data.recoleccion_id}, new_vals, {
                        success: function () {
                            PickupModel.get({success: function(tx, results){
                                App.operations.pickups= results._all;
                            }});
                            if (!cordova.plugins.backgroundMode.isActive()) {
                                ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                                if(_data.recoleccion_id == App.operations.current_pickup.id){
                                    App.operations.current_pickup.state_id= 300;
                                    $('#pickup_exception_modal').modal('hide');
                                }
                            }
                        }
                    });
                }
            });
        });
        $('#delivery_exception_modal form').submit(function (event) {
            event.preventDefault();
            var form= $(this);
            form.loading();
            var data= FormUtility_.serialized_data_to_json(form.serializeArray());
            data.entrega_id= App.operations.current_delivery.id;
            AjaxQueue.add({
                process_name: 'Delivery guardar excepción: ',
                type: 'post',
                url: 'delivery/store_exception',
                dataType: 'json',
                data: data,
                success: function(response){
                    if(typeof form === 'object')form.unloading();
                    DeliveriesModel.update({id: response.data.id}, response.data, {
                        success: function () {
                            App.operations.current_delivery = response.data;
                            DeliveriesModel.get({success: function(tx, results){
                                App.operations.deliveries= results._all;
                            }});
                            if(!cordova.plugins.backgroundMode.isActive()) {
                                ToastrUtility_.success(response.message);
                                if(response.data.id == App.operations.current_delivery.id)
                                    $('#delivery_exception_modal').modal('hide');
                            }
                        }
                    });
                },
                fail: function(_data){
                    var new_vals= {state_id: 300, state: "Excepción"};
                    if(typeof form === 'object')form.unloading();
                    DeliveriesModel.update({id: _data.entrega_id}, new_vals, {
                        success: function () {
                            DeliveriesModel.get({success: function(tx, results){
                                App.operations.deliveries= results._all;
                            }});
                            if(!cordova.plugins.backgroundMode.isActive()) {
                                ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                                if(_data.entrega_id == App.operations.current_delivery.id){
                                    App.operations.current_delivery.state_id= 300;
                                    $('#delivery_exception_modal').modal('hide');
                                }
                            }
                        }
                    });
                },
            });
        });
        /** <!-- CIERRA STORE DE EXCEPCIONES */

        /** ABRE STORE DE EXITOSAS */
        $('#delivery_success_modal, #pickup_success_modal').on('show.bs.modal', function () {
            $(this).find('[name]:not([default-value])').val('');
            $(this).find('[default-value]').each(function(){
                $(this).val($(this).attr('default-value'));
            });
            $(this).find('[current_time]').val(
                MomentUtility_.current_time().substr(0,5)
            );
            $(this).find('[current_date]').val(MomentUtility_.current_date());
        });
        $('#pickup_success_modal form').submit(function (event) {
            event.preventDefault();
            var form= $(this);
            form.loading();
            var data= FormUtility_.serialized_data_to_json(form.serializeArray());
            data.recoleccion_id= App.operations.current_pickup.id;
            AjaxQueue.add({
                process_name: 'Pickup exitoso: ',
                type: 'post',
                url: 'pickup/store_successful',
                dataType: 'json',
                data: data,
                success: function(response){
                    if(typeof form === 'object')form.unloading();
                    PickupModel.update({id: response.data.id}, response.data, {
                        success: function () {
                            App.operations.current_pickup = response.data;
                            PickupModel.get({success: function(tx, results){
                                App.operations.pickups= results._all;
                            }});
                            if(!cordova.plugins.backgroundMode.isActive()) {
                                ToastrUtility_.success(response.message);
                                if(response.data.id == App.operations.current_pickup.id)
                                    $('#pickup_success_modal').modal('hide');
                            }
                        }
                    });
                },
                fail: function(_data){
                    var new_vals= {state_id: 200, state: "Realizada"};
                    if(typeof form === 'object')form.unloading();
                    PickupModel.update({id: _data.recoleccion_id}, new_vals, {
                        success: function () {
                            PickupModel.get({success: function(tx, results){
                                App.operations.pickups= results._all;
                            }});
                            if(!cordova.plugins.backgroundMode.isActive()) {
                                ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                                if(_data.recoleccion_id == App.operations.current_pickup.id){
                                    App.operations.current_pickup.state_id= 200;
                                    $('#pickup_success_modal').modal('hide');
                                }
                            }
                        }
                    });
                },
            });
        });
        $('#delivery_success_modal form').submit(function (event) {
            event.preventDefault();
            var form= $(this);
            form.loading();
            var data= FormUtility_.serialized_data_to_json(form.serializeArray());
            data.entrega_id= App.operations.current_delivery.id;
            AjaxQueue.add({
                process_name: 'Delivery exitoso: ',
                type: 'post',
                url: 'delivery/store_successful',
                dataType: 'json',
                data: data,
                success: function(response){
                    if(typeof form === 'object')form.unloading();
                    DeliveriesModel.update({id: response.data.id}, response.data, {
                        success: function () {
                            App.operations.current_delivery = response.data;
                            DeliveriesModel.get({success: function(tx, results){
                                App.operations.deliveries= results._all;
                            }});
                            if(!cordova.plugins.backgroundMode.isActive()) {
                                ToastrUtility_.success(response.message);
                                if(response.data.id == App.operations.current_delivery.id)
                                    $('#delivery_success_modal').modal('hide');
                            }
                        }
                    });
                },
                fail: function(_data){
                    var new_vals= {state_id: 200, state: "Realizada"};
                    if(typeof form === 'object')form.unloading();
                    DeliveriesModel.update({id: _data.entrega_id}, new_vals, {
                        success: function () {
                            DeliveriesModel.get({success: function(tx, results){
                                App.operations.deliveries= results._all;
                            }});
                            if(!cordova.plugins.backgroundMode.isActive()) {
                                ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                                if(_data.entrega_id == App.operations.current_delivery.id){
                                    App.operations.current_delivery.state_id= 200;
                                    $('#delivery_success_modal').modal('hide');
                                }
                            }
                        }
                    });
                },
            });
        });
        /** <!-- CIERRA STORE DE EXITOSAS */


        /** ABRE ASOCIAR GUIAS */
        $('#pickup_consignments_modal').on('show.bs.modal', function () {
            try{
                var consignments= [];
                if(typeof App.operations.current_pickup.consignments === 'object')
                    consignments= App.operations.current_pickup.consignments;
                else if(App.operations.current_pickup.consignments !== undefined)
                    consignments= App.operations.current_pickup.consignments.split(",");

                $('#pickup_consignments_modal [name="guias"]').val(
                    consignments.join("\n")
                );
            }catch (e){ alert('Show-delivery_consignments_modal: '+e.message); }
        });
        $('#delivery_consignments_modal').on('show.bs.modal', function () {
            try{
                var consignments= [];
                if(typeof App.operations.current_delivery.consignments === 'object')
                    consignments= App.operations.current_delivery.consignments;
                else if(App.operations.current_delivery.consignments !== undefined)
                    consignments= App.operations.current_delivery.consignments.split(",");

                $('#delivery_consignments_modal [name="guias"]').val(
                    consignments.join("\n")
                );
            }catch (e){ alert('Show-delivery_consignments_modal: '+e.message); }
        });
        $('#pickup_consignments_modal form').submit(function (event) {
            event.preventDefault();
            var form= $(this);
            var data= FormUtility_.serialized_data_to_json(form.serializeArray());
            data.recoleccion_id= App.operations.current_pickup.id;
            if($.trim(data.guias)==''){
                alert('Campo guías es obligatorio');
                return false;
            }
            form.loading();
            AjaxQueue.add({
                process_name: 'Pickup asociación guías: ',
                type: 'post',
                url: 'pickup/update_consignments',
                dataType: 'json',
                data: data,
                success: function(response){
                    if(typeof form === 'object')form.unloading();
                    PickupModel.update({id: response.data.id}, response.data, {
                        success: function () {
                            App.operations.current_pickup = response.data;
                            PickupModel.get({success: function(tx, results){
                                App.operations.pickups= results._all;
                            }});
                            if(!cordova.plugins.backgroundMode.isActive()) {
                                ToastrUtility_.success(response.message);
                                if(response.data.id == App.operations.current_pickup.id)
                                    $('#pickup_consignments_modal').modal('hide');
                            }
                        }
                    });
                },
                fail: function(_data){
                    if(typeof form === 'object')form.unloading();
                    PickupModel.update({id: _data.recoleccion_id}, {consignments: _data.guias.split("\n")}, {
                        success: function () {
                            PickupModel.get({success: function(tx, results){
                                App.operations.pickups= results._all;
                            }});
                            if(!cordova.plugins.backgroundMode.isActive()) {
                                ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                                if(_data.recoleccion_id== App.operations.current_pickup.id)
                                    $('#pickup_consignments_modal').modal('hide');
                            }
                        }
                    });
                }
            });
        });
        $('#delivery_consignments_modal form').submit(function (event) {
            event.preventDefault();
            var form= $(this);
            var data= FormUtility_.serialized_data_to_json(form.serializeArray());
            data.entrega_id= App.operations.current_delivery.id;
            if($.trim(data.guias)==''){
                alert('Campo guías es obligatorio');
                return false;
            }
            form.loading();
            AjaxQueue.add({
                process_name: 'Delivery asociación guías: ',
                type: 'post',
                url: 'delivery/update_consignments',
                dataType: 'json',
                data: data,
                success: function(response){
                    if(typeof form === 'object')form.unloading();
                    DeliveriesModel.update({id: response.data.id}, response.data, {
                        success: function () {
                            App.operations.current_delivery = response.data;
                            DeliveriesModel.get({success: function(tx, results){
                                App.operations.deliveries= results._all;
                            }});
                            if(!cordova.plugins.backgroundMode.isActive()) {
                                ToastrUtility_.success(response.message);
                                if(response.data.id == App.operations.current_delivery.id)
                                    $('#delivery_consignments_modal').modal('hide');
                            }
                        }
                    });
                },
                fail: function(_data){
                    if(typeof form === 'object')form.unloading();
                    DeliveriesModel.update({id: _data.entrega_id}, {consignments: _data.guias.split("\n")}, {
                        success: function () {
                            DeliveriesModel.get({success:function(tx, results){
                                App.operations.deliveries= results._all;
                            }});
                            if(!cordova.plugins.backgroundMode.isActive()) {
                                ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                                if(_data.entrega_id == App.operations.current_delivery.id)
                                    $('#delivery_consignments_modal').modal('hide');
                            }
                        }
                    });
                }
            });
        });
        /** <!-- CIERRA ASOCIAR GUIAS */

        /** ABRE IMPRESION DE LABELS */
        $('#print_pickup_label form').submit(function (event) {
            event.preventDefault();
            try{
                var type_print= App.settings_current_printer_code;
                connectPrinter(App.settings_current_printer, {
                    success: function(){
                        PrinterFormat.pickup_label(type_print);
                        $('#print_pickup_label').modal('hide');
                    }
                });
            }catch (error){
                alert('Error al imprimir '+error.message);
            }
        });
        $('#print_delivery_label form').submit(function (event) {
            event.preventDefault();
            try{
                var type_print= App.settings_current_printer_code;
                connectPrinter(App.settings_current_printer, {
                    success: function(){
                        PrinterFormat.delivery_label(type_print);
                        $('#print_delivery_label').modal('hide');
                    }
                });
            }catch (error){
                alert('Error al imprimir '+error.message);
            }
        });
        /** <!-- CIERRA IMPRESION DE LABELS */

        function connectPrinter(printer_address ,callbacks){
            try{
                callbacks= PolishedUtility_.callback(callbacks);
                window.DatecsPrinter.connect(printer_address,
                    function() {
                        callbacks.success();
                        PrinterModel.update({id: 1}, {address:printer_address, code:App.settings_current_printer_code});
                    },
                    function(error) {alert('Error al conectar con impresora: '+error.message); callbacks.fail();}
                );
            }catch (error){
                alert('Error al conectar con impresora_: '+error.message);
            }
        }


        /** ABRE OCULTAR ELEMENTOS FUERA DE LA PÁGINA*/
        $(document).scroll(function() {
            $('.tab-pane.active>.list-group>a').each(function(){
                if($(this).isOnScreen()){
                    $(this).removeClass('isnt_in_viewport');
                }else{
                    $(this).addClass('isnt_in_viewport');
                }
            })
        });

        /** <!-- CIERRA OCULTAR ELEMENTOS FUERA DE LA PÁGINA */


        /** ABRE FILTRO ELEMENTOS*/
        $("#filter_by_state_modal .state_filter").click(function() {
            var val= $(this).val();
            App.visible_states[val]= $(this).is(':checked');
            App.reload_lists();
            App.refresh_counters_in_list();
        });
        $("#filter_by_state_modal .state_filter[value='50']").click();
        $("#filter_by_state_modal .state_filter[value='100']").click();

        /** <!-- CIERRA FILTRO ELEMENTOS */
    });




    /** Ready on mobiles **/
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        cordova.plugins.diagnostic.isBluetoothAvailable(function(available) {
            if (available) {
                scanBluetoohtDevices();
            }
        });
    }
}

function scanBluetoohtDevices(){
    window.DatecsPrinter.listBluetoothDevices(
        function (devices) {
            App.bluetooth_devices= devices;
        },
        function (error) {
            alert('Error: '+error.message);
        }
    );
}

function open_navigation(object){
    launchnavigator.navigate(object.address+', '+object.city);
}

function printText() {

    window.DatecsPrinter.feedPaper(1);
    var text= prompt('Texto a imprimir');
    window.DatecsPrinter.printText(text, 'ISO-8859-1');
    window.DatecsPrinter.feedPaper(1);

    /*window.DatecsPrinter.printBarcode(
        69, //here goes the barcode type code
        text, //your barcode data
        function() {},
        function() {alert(error.message);}
    );
    window.DatecsPrinter.feedPaper(1);*/
}