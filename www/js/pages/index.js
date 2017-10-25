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
            ajax_queue_count: 0
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
                element.loading();
                AjaxQueue.check_queue({
                    empty:function(){
                        App_.ajax_queue_count= Ajax_queueModel.get().length;
                        element.unloading();
                        ToastrUtility_.success('Cola vacía');
                    },
                    fail: function(properties, jqXHR, textStatus){
                        App_.ajax_queue_count= Ajax_queueModel.get().length;
                        element.unloading();
                        ToastrUtility_.error('Fallo transmisión'+ JSON.stringify({
                            jqXHR: jqXHR, textStatus: textStatus
                        }));
                        LogModel.store({
                            message: 'Error al transmitir al servidor petición online, procesamiento de cola.',
                            status: 'danger',
                            data:  JSON.stringify({
                                jqXHR: jqXHR, textStatus: textStatus, properties: properties
                            })
                        });
                    },
                    success: function(properties, response){
                        App_.ajax_queue_count= Ajax_queueModel.get().length;

                        LogModel.store({
                            message: 'Transmisión de petición online a servidor exitosa, procesamiento de cola.',
                            status: 'success',
                            data: {properties: properties, response: response}
                        });
                    }
                });
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

            Ajax_queueModel.loaded(function(){
                App_.ajax_queue_count= Ajax_queueModel.get().length;
            });
        }
    });

    $(document).ready(function(){
        $('.takePhoto').click(function(event){
            event.preventDefault();
            var current_element= $(this);
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
            var current_element= $(this);
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
                        alert(response.message);
                    }
                },
                failed_online: function(jqXHR, textStatus){
                    form.unloading();
                    ToastrUtility_.warning(jqXHR.status+'=>'+jqXHR.responseJSON.message+" <br>Sin conexion a servidor, se transmitira más tarde.");
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
                        alert(response.message);
                    }
                },
                failed_online: function(jqXHR, textStatus){
                    form.unloading();
                    ToastrUtility_.warning(jqXHR.status+'=>'+jqXHR.responseJSON.message+" <br>Sin conexion a servidor, se transmitira más tarde.");
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
                        alert(response.message);
                    }
                },
                failed_online: function(jqXHR, textStatus){
                    form.unloading();
                    ToastrUtility_.warning(jqXHR.status+'=>'+jqXHR.responseJSON.message+" <br>Sin conexion a servidor, se transmitira más tarde.");
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
                        alert(response.message);
                    }
                },
                failed_online: function(jqXHR, textStatus){
                    form.unloading();
                    ToastrUtility_.warning(jqXHR.status+'=>'+jqXHR.responseJSON.message+" <br>Sin conexion a servidor, se transmitira más tarde.");
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
                        alert(response.message);
                    }
                },
                failed_online: function(jqXHR, textStatus){
                    form.unloading();
                    ToastrUtility_.warning(jqXHR.status+'=>'+jqXHR.responseJSON.message+" <br>Sin conexion a servidor, se transmitira más tarde.");
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
                        alert(response.message);
                    }
                },
                failed_online: function(jqXHR, textStatus){
                    form.unloading();
                    ToastrUtility_.warning(jqXHR.status+'=>'+jqXHR.responseJSON.message+" <br>Sin conexion a servidor, se transmitira más tarde.");
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
}