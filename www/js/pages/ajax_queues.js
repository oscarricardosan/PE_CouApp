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
            current_position: undefined,
            current_position_updated: undefined
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
                        Ajax_queueModel.loaded(function () {
                            App_.ajax_queues = Ajax_queueModel.get();
                            App_.ajax_queue_count = Ajax_queueModel.get().length;
                        });
                        $('button.submit').unloading();
                        alert('Cola vacía');
                    },
                    fail: function () {
                        Ajax_queueModel.loaded(function () {
                            App_.ajax_queues = Ajax_queueModel.get();
                            App_.ajax_queue_count = Ajax_queueModel.get().length;
                        });
                        $('button.submit').unloading();
                        alert('Fallo transmisión');
                    },
                    success: function () {
                        Ajax_queueModel.loaded(function () {
                            App_.ajax_queues = Ajax_queueModel.get();
                            App_.ajax_queue_count = Ajax_queueModel.get().length;
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
            UserModel.loaded(function () {
                var user = UserModel.get();
                if (user !== null) {
                    App_.user.email = user.user_data.email;
                    App_.user.name = user.user_data.name;
                }
            });

            DeliveriesModel.loaded(function () {
                App_.operations.deliveries = DeliveriesModel.get();
            });

            PickupModel.loaded(function () {
                App_.operations.pickups = PickupModel.get();
            });

            Ajax_queueModel.loaded(function () {
                App_.ajax_queues = Ajax_queueModel.get();
                App_.ajax_queue_count = Ajax_queueModel.get().length;
            });
        }
    });
}