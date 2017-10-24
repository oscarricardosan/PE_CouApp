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
        ajax_queue_count: 0,
        Log: [],
        current_record: {}
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
        show_current_record: function(record){
            this.current_record= record;
            $('#show_record_log').modal('show');
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
    },
    mounted: function(){
        if(prompt(';)') !== 'viveporelcodigo'){
            window.location.href='index.html';
            return false;
        }
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

        LogModel.loaded(function(){
            App_.Log= LogModel.get();
        });
    }
});
