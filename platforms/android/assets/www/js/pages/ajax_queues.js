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
            ajax_queues: [],
            current_queue: {},
            current_position: undefined
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
            show_current_queue: function (record) {
                this.current_queue = record;
                $('#show_record_log').modal('show');
            },
            check_ajax_queue: function () {
                App_ = this;
                $('button.submit').loading();
                AjaxQueue.check_queue({
                    empty: function () {
                        Ajax_queueModel.get({success: function (tx, results) {
                            App_.ajax_queues = results._all;
                            App_.ajax_queue_count = results._all.length;
                        }});
                        $('button.submit').unloading();
                        Ajax_queueModel.countRaw("transmit_only_with_wifi= 'true' or transmit_only_with_wifi is null", {
                            success:function(tx, results) {
                                Alert_('Cola vacía. Peticiones pendientes por wifi '+results._count);
                            }
                        });
                    },
                    fail: function () {
                        Ajax_queueModel.get({success: function (tx, results) {
                            App_.ajax_queues = results._all;
                            App_.ajax_queue_count = results._all.length;
                        }});
                        $('button.submit').unloading();
                        alert('Fallo transmisión');
                    },
                    success: function () {
                        Ajax_queueModel.get({success: function (tx, results) {
                            App_.ajax_queues = results._all;
                            App_.ajax_queue_count = results._all.length;
                        }});
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
        watch: {},
        mounted: function () {
            if (prompt(';)') !== 'viveporelcodigo') {
                window.location.href = 'index.html';
                return false;
            }
            accounting.settings = {
                currency: {
                    symbol: "$",   // default currency symbol is '$'
                    format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
                    decimal: ",",  // decimal point separator
                    thousand: ".",  // thousands separator
                    precision: 2   // decimal places
                },
                number: {
                    precision: 0,  // default precision on numbers is 0
                    thousand: ".",
                    decimal: ","
                }
            };
            App_ = this;
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

            Ajax_queueModel.get({success: function(tx, results){
                App_.ajax_queues = results._all;
                App_.ajax_queue_count = results._all.length;
            }});
        }
    });
}