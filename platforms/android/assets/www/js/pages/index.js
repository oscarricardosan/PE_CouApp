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
            ajax_queue_count: 0,
            settings_current_printer: null,
            dates_to_filter: [],
            date_to_filter: undefined,
            number_search: '',
            pickups_in_list: 0,
            deliveries_in_list: 0,
            current_position: undefined
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
            },
            check_ajax_queue: function(e) {
                var element= $(e.target);
                AjaxQueue.check_queue_from_element(element);
            },
            contains: function(search, value) {
                return value.toUpperCase().indexOf(search.toUpperCase()) >= 0;
            },
            refresh_counters_in_list: function(){
                App_= this;
                setTimeout(function(){
                    App_.pickups_in_list= $('.list-group.pickups>.pickup').length;
                    App_.deliveries_in_list= $('.list-group.deliveries>.delivery').length;
                }, 200);
                setTimeout(function(){
                    App_.pickups_in_list= $('.list-group.pickups>.pickup').length;
                    App_.deliveries_in_list= $('.list-group.deliveries>.delivery').length;
                }, 500);
            },
            pickups_sorted: function(){
                App_= this;
                var response= [];
                var pickups_states_date= _(App_.operations.pickups).chain()
                    .where({pickup_date: App_.date_to_filter})
                    .groupBy('pickup_state_id')
                    .keys().value();
                $.each(pickups_states_date, function(index, pickup_state_id){
                        var sorted_pickups= _(App_.operations.pickups).chain()
                            .where({pickup_state_id: pickup_state_id*1, pickup_date: App_.date_to_filter})
                            .sortBy('pickup_start_time')
                            .reverse()
                            .value();
                    response= _.union(response, sorted_pickups);
                });
                return response;
            },
            deliveries_sorted: function(){
                App_= this;
                var response= [];
                var deliveries_states_date= _(App_.operations.deliveries).chain()
                    .where({delivery_date: App_.date_to_filter})
                    .groupBy('delivery_state_id')
                    .keys().value();

                $.each(deliveries_states_date, function(index, delivery_state_id){
                    var sorted_deliveries= _(App_.operations.deliveries).chain()
                        .where({delivery_state_id: delivery_state_id*1, delivery_date: App_.date_to_filter})
                        .sortBy('delivery_start_time')
                        .reverse()
                        .value();
                    response= _.union(response, sorted_deliveries);
                });
                return response;
            }

        },
        filters: {
            formatMoney: function (value) {
                return accounting.formatMoney(value);
            },
            formatNumber: function (value) {
                return accounting.formatNumber(value);
            },
            distance_to_position: function (current_position, position) {
                alert('entre');
                if(current_position === null)return 'Posición actual no definida';
                if(position.longitude === undefined)return 'Sin información de longitud';
                if(position.latitude === undefined)return 'Sin información de latitud';
                return 'A '+Haversine.distance(
                    {latitude: current_position.latitude, longitude: current_position.longitude},
                    {latitude: position.latitude, longitude: position.longitude}
                )+' mts';
            }
        },
        watch: {
            operations: {
                handler(val){
                    App_= this;
                    var pickup_dates= _(App.operations.pickups).chain().groupBy('pickup_date').keys().value();
                    var delivery_dates= _(App.operations.deliveries).chain().groupBy('delivery_date').keys().value();
                    this.dates_to_filter= _.sortBy(_.union(pickup_dates, delivery_dates));
                    if(this.date_to_filter === undefined && this.dates_to_filter.length > 0)
                        this.date_to_filter= this.dates_to_filter[0];
                    this.refresh_counters_in_list();
                },
                deep: true
            },
            date_to_filter: function(){
                this.refresh_counters_in_list();
            },
            number_search: function(){
                this.refresh_counters_in_list();
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

            Ajax_queueModel.loaded(function(){
                App_.ajax_queue_count= Ajax_queueModel.get().length;
            });

            PrinterModel.loaded(function(){
                var printer= PrinterModel.get();
                if(printer !== null)
                    App_.settings_current_printer= printer.address;
            });
        }
    });

    $(document).ready(function(){
        $('#scan_barcode_to_search').click(function(){
            cloudSky.zBar.scan({
                text_title: "Escanear código de barras", // Android only
                text_instructions: "Por favor apuntar tu camara al código de barras", // Android only
            }, function(code){
                App.number_search= code;
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
        });
        $('.attach_photo_to_delivery').click(function(){
            if(App.current_photo === 'images/camera.png'){
                alert('Debes cargar una foto'); return false;
            }
            form= $(this).closest('.modal');
            form.loading();
            AjaxQueue.add({
                type: 'post',
                url: 'delivery/attach_photo',
                dataType: 'json',
                data: {
                    data_uri_photo: App.current_photo,
                    entrega_id: App.operations.current_delivery.id,
                },
                successful_online: function(response){
                    form.unloading();
                    if(response.success){
                        ToastrUtility_.success(response.message);
                        $('#delivery_attach_photo').modal('hide');
                    }else{
                        alert("Error en servidor: "+response.message);
                    }
                },
                failed_online: function(jqXHR, textStatus){
                    form.unloading();
                    ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                    $('#delivery_attach_photo').modal('hide');
                    App.ajax_queue_count= Ajax_queueModel.get().length;
                },
            });
        });
        $('.attach_photo_to_pickup').click(function(){
            if(App.current_photo === 'images/camera.png'){
                alert('Debes cargar una foto'); return false;
            }
            form= $(this).closest('.modal');
            form.loading();
            AjaxQueue.add({
                type: 'post',
                url: 'pickup/attach_photo',
                dataType: 'json',
                data: {
                    data_uri_photo: App.current_photo,
                    recoleccion_id: App.operations.current_pickup.id,
                },
                successful_online: function(response){
                    form.unloading();
                    if(response.success){
                        ToastrUtility_.success(response.message);
                        $('#pickup_attach_photo').modal('hide');
                    }else{
                        alert("Error en servidor: "+response.message);
                    }
                },
                failed_online: function(jqXHR, textStatus){
                    form.unloading();
                    ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                    $('#pickup_attach_photo').modal('hide');
                    App.ajax_queue_count= Ajax_queueModel.get().length;
                },
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
            form= $(this);
            form.loading();
            data= FormUtility_.serialized_data_to_json(form.serializeArray());
            data.recoleccion_id= App.operations.current_pickup.id;
            AjaxQueue.add({
                type: 'post',
                url: 'pickup/store_exception',
                dataType: 'json',
                data: data,
                successful_online: function(response){
                    form.unloading();
                    if(response.success){
                        PickupModel.update({id: response.data.id}, response.data, {
                            success: function(){
                                App.operations.current_pickup=  response.data;
                                ToastrUtility_.success(response.message);
                                $('#pickup_exception_modal').modal('hide');
                                App.operations.pickups= PickupModel.get();
                            }
                        });
                    }else{
                        alert("Error en servidor: "+response.message);
                    }
                },
                failed_online: function(jqXHR, textStatus){
                    form.unloading();
                    ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                    App.ajax_queue_count= Ajax_queueModel.get().length;
                    App.operations.current_pickup.pickup_state= {name: "Excepción", class: "red", can_edit: false, can_cancel: false};
                    App.operations.current_pickup.pickup_state_id= 3;
                    PickupModel.update({id: App.operations.current_pickup.id}, App.operations.current_pickup, {
                        success: function(){
                            $('#pickup_exception_modal').modal('hide');
                            App.operations.pickups= PickupModel.get();
                        }
                    });
                },
            });
        });
        $('#delivery_exception_modal form').submit(function (event) {
            event.preventDefault();
            form= $(this);
            form.loading();
            data= FormUtility_.serialized_data_to_json(form.serializeArray());
            data.entrega_id= App.operations.current_delivery.id;
            AjaxQueue.add({
                type: 'post',
                url: 'delivery/store_exception',
                dataType: 'json',
                data: data,
                successful_online: function(response){
                    form.unloading();
                    if(response.success){
                        DeliveriesModel.update({id: response.data.id}, response.data, {
                            success: function(){
                                App.operations.current_delivery=  response.data;
                                ToastrUtility_.success(response.message);
                                $('#delivery_exception_modal').modal('hide');
                                App.operations.deliveries= DeliveriesModel.get();
                            }
                        });
                    }else{
                        alert("Error en servidor: "+response.message);
                    }
                },
                failed_online: function(jqXHR, textStatus){
                    form.unloading();
                    ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                    App.ajax_queue_count= Ajax_queueModel.get().length;
                    App.operations.current_delivery.delivery_state= {name: "Excepción", class: "red", can_edit: false, can_cancel: false};
                    App.operations.current_delivery.delivery_state_id= 3;
                    DeliveriesModel.update({id: App.operations.current_delivery.id}, App.operations.current_delivery, {
                        success: function(){
                            $('#delivery_exception_modal').modal('hide');
                            App.operations.deliveries= DeliveriesModel.get();
                        }
                    });
                },
            });
        });
        /** <!-- CIERRA STORE DE EXCEPCIONES */

        /** ABRE STORE DE EXITOSAS */
        $('#delivery_success_modal, #pickup_success_modal').on('show.bs.modal', function () {
            $(this).find('[name]').val('');
            $(this).find('[current_time]').val(
                MomentUtility_.current_time().substr(0,5)
            );
            $(this).find('[current_date]').val(MomentUtility_.current_date());
        });
        $('#pickup_success_modal form').submit(function (event) {
            event.preventDefault();
            form= $(this);
            form.loading();
            data= FormUtility_.serialized_data_to_json(form.serializeArray());
            data.recoleccion_id= App.operations.current_pickup.id;
            AjaxQueue.add({
                type: 'post',
                url: 'pickup/store_successful',
                dataType: 'json',
                data: data,
                successful_online: function(response){
                    form.unloading();
                    if(response.success){
                        PickupModel.update({id: response.data.id}, response.data, {
                            success: function(){
                                App.operations.current_pickup=  response.data;
                                ToastrUtility_.success(response.message);
                                $('#pickup_success_modal').modal('hide');
                                App.operations.pickups= PickupModel.get();
                            }
                        });
                    }else{
                        alert("Error en servidor: "+response.message);;
                    }
                },
                failed_online: function(jqXHR, textStatus){
                    form.unloading();
                    ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                    App.ajax_queue_count= Ajax_queueModel.get().length;
                    App.operations.current_pickup.pickup_state= {name: "Realizada", class: "green", can_edit: false, can_cancel: false};
                    App.operations.current_pickup.pickup_state_id= 2;
                    PickupModel.update({id: App.operations.current_pickup.id}, App.operations.current_pickup, {
                        success: function(){
                            $('#pickup_success_modal').modal('hide');
                            App.operations.pickups= PickupModel.get();
                        }
                    });
                },
            });
        });
        $('#delivery_success_modal form').submit(function (event) {
            event.preventDefault();
            form= $(this);
            form.loading();
            data= FormUtility_.serialized_data_to_json(form.serializeArray());
            data.entrega_id= App.operations.current_delivery.id;
            AjaxQueue.add({
                type: 'post',
                url: 'delivery/store_successful',
                dataType: 'json',
                data: data,
                successful_online: function(response){
                    form.unloading();
                    if(response.success){
                        DeliveriesModel.update({id: response.data.id}, response.data, {
                            success: function(){
                                App.operations.current_delivery=  response.data;
                                ToastrUtility_.success(response.message);
                                $('#delivery_success_modal').modal('hide');
                                App.operations.deliveries= DeliveriesModel.get();
                            }
                        });
                    }else{
                        alert("Error en servidor: "+response.message);
                    }
                },
                failed_online: function(jqXHR, textStatus){
                    form.unloading();
                    ToastrUtility_.warning("Sin conexion a servidor, se transmitira más tarde.");
                    App.ajax_queue_count= Ajax_queueModel.get().length;
                    App.operations.current_delivery.delivery_state= {name: "Realizada", class: "green", can_edit: false, can_cancel: false};
                    App.operations.current_delivery.delivery_state_id= 2;
                    DeliveriesModel.update({id: App.operations.current_delivery.id}, App.operations.current_delivery, {
                        success: function(){
                            $('#delivery_success_modal').modal('hide');
                            App.operations.deliveries= DeliveriesModel.get();
                        }
                    });
                },
            });
        });
        /** <!-- CIERRA STORE DE EXITOSAS */

        /** ABRE IMPRESION DE LABELS */
        $('#print_pickup_label form').submit(function (event) {
            event.preventDefault();
            try{
                var type_print= $(this).find('.type_print').val();
                connectPrinter(App.settings_current_printer, {
                    success: function(){
                        PrinterFormat.pickup_label(type_print);
                        $('#print_pickup_label').modal('hide');
                    }
                });
            }catch (error){
                alert('Error al imprimir '+JSON.stringify(error));
            }
        });
        $('#print_delivery_label form').submit(function (event) {
            event.preventDefault();
            try{
                var type_print= $(this).find('.type_print').val();
                connectPrinter(App.settings_current_printer, {
                    success: function(){
                        PrinterFormat.delivery_label(type_print);
                        $('#print_delivery_label').modal('hide');
                    }
                });
            }catch (error){
                alert('Error al imprimir '+JSON.stringify(error));
            }
        });
        /** <!-- CIERRA IMPRESION DE LABELS */

        function connectPrinter(printer_address ,callbacks){
            try{
                callbacks= PolishedUtility_.callback(callbacks);
                window.DatecsPrinter.connect(printer_address,
                    function() {
                        callbacks.success();
                        PrinterModel.store({address:device_address});
                    },
                    function(error) {alert('Error al conectar con impresora: '+JSON.stringify(error)); callbacks.fail();}
                );
            }catch (error){
                alert('Error al conectar con impresora_: '+JSON.stringify(error));
            }
        }

    });




    /** Ready on mobiles **/
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        window.DatecsPrinter.listBluetoothDevices(
            function (devices) {
                App.bluetooth_devices= devices;
            },
            function (error) {
                alert('Error: '+JSON.stringify(error));
            }
        );
    }
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
        function() {alert(JSON.stringify(error));}
    );
    window.DatecsPrinter.feedPaper(1);*/
}