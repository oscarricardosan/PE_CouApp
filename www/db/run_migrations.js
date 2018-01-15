var Migrations= (function () {

    var run= function(){
        DB.transaction(function(transaction) {
            transaction.executeSql('CREATE TABLE IF NOT EXISTS migrations (id integer primary key, version integer, desc text)', [],
                function(tx, result) {
                    MigrationModel.get_version({
                        success: function(tx, results){
                            if(results._first.version === null){
                                run_migration_0();
                            }else if(results._first.version == 1) {
                                run_migration_1();
                            }else{
                                runApp();
                            }
                        }
                    });
                },
                function(error) {
                    alert("Error creando tabla migraciones. "+error.message);
                }
            );
        });
    };

    function run_migration_0(){
        var create_table= {
            user: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS user (id integer primary key, success text, token_mobile text, message text, email text, name text, token_generated_at text)', [],
                        function (tx, result) {create_table.settings();},
                        function (error) {alert("Error creando tabla user. " + error.message);}
                    );
                });
            },
            settings: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS settings (id integer primary key, domain text, url_server text, transmit_pickup_photos_only_wifi text, transmit_delivery_photos_only_wifi text )', [],
                        function (tx, result) {create_table.setting_printer();},
                        function (error) {alert("Error creando tabla settings. " + error.message);}
                    );
                });
            },
            setting_printer: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS setting_printer (id integer primary key, address text, code text, type text)', [],
                        function (tx, result) {
                            PrinterModel.insert({id: 1}, {success: function () {
                                create_table.setting_gps();
                            }});
                        },
                        function (error) {alert("Error creando tabla setting_printer. " + error.message);}
                    );
                });
            },
            setting_gps: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS setting_gps (id integer primary key, latitude text, longitude text)', [],
                        function (tx, result) {create_table.log();},
                        function (error) {alert("Error creando tabla setting_gps. " + error.message);}
                    );
                });
            },
            log: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS log (id integer primary key, message text, data text, status text, created_at text)',
                        [],
                        function (tx, result) {create_table.ajax_queue();},
                        function (error) {alert("Error creando tabla log. " + error.message);}
                    );
                });
            },
            ajax_queue: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS ajax_queue(' +
                        'id integer primary key, process_name text, type text, url text, dataType text, ' +
                        'data text, success text, fail text, created_at text, transmit_only_with_wifi text' +
                        ')',
                        [],
                        function (tx, result) {create_table.processes();},
                        function (error) {alert("Error creando tabla ajax_queue. " + error.message);}
                    );
                });
            },
            processes: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS processes ' +
                        '(id integer primary key, get_events text, proximity_alert text, time_alert text, check_ajax_queue text, gps_tracking text)',
                        [],
                        function (tx, result) {
                            ProcessModel.insert({id: 1}, {success: function () {
                                create_table.pickups();
                            }});
                        },
                        function (error) {alert("Error creando tabla processes. " + error.message);}
                    );
                });
            },
            pickups: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS pickups ' +
                            '(id integer primary key, date text, start_time text, end_time text, number text, ' +
                            'company text, address text, long_address text, doc text, contact text, phone text, ' +
                            'obs text, state text, city text, val text, content text, lat text, long text, ' +
                            'state_id integer, consignments text, distance_in_mts real, attemp_gps_alert integer' +
                        ')',
                        [],
                        function (tx, result) {create_table.deliveries();},
                        function (error) {alert("Error creando tabla pickups. " + error.message);}
                    );
                });
            },
            deliveries: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS deliveries ' +
                            '(id integer primary key, date text, start_time text, end_time text, number text, ' +
                            'company text, address text, long_address text, doc text, contact text, phone text, ' +
                            'obs text, state text, city text, val text, content text, lat text, long text, ' +
                            'state_id integer, consignments text, distance_in_mts real, attemp_gps_alert integer' +
                        ')',
                        [],
                        function (tx, result) {
                            MigrationModel.insert({
                                id: 1,
                                version: 1,
                                desc: 'Migracion inicial'
                            }, {
                                success: function(){
                                    run_migration_1();
                                }
                            });
                        },
                        function (error) {alert("Error creando tabla deliveries. " + error.message);}
                    );
                });
            }
        };
        try{
            create_table.user();
        }catch (e){alert(e.message);}
    }

    function run_migration_1(){
        var create_table= {
            exceptions_to_pickup: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS exceptions_to_pickup (id integer primary key, name text)', [],
                        function (tx, result) {
                            Exception_to_pickupModel.insert_multiple([
                                {name: 'Nadie en casa'},
                                {name: 'En vacaciones'},
                                {name: 'Dirección errada'},
                                {name: 'Otros'}
                            ], {success: function(){
                                create_table.exceptions_to_delivery();
                            }});

                        },
                        function (error) {alert("Error creando exceptions_to_pickup user. " + error.message);}
                    );
                });
            },
            exceptions_to_delivery: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS exceptions_to_delivery (id integer primary key, name text)', [],
                        function (tx, result) {
                            Exception_to_deliveryModel.insert_multiple([
                                {name: 'Nadie en casa'},
                                {name: 'En vacaciones'},
                                {name: 'Dirección errada'},
                                {name: 'Otros'}
                            ], {success: function(){
                                    MigrationModel.insert({
                                        id: 2,
                                        version: 2,
                                        desc: 'Se crean tablas para excepciones'
                                    }, {
                                        success: function(){
                                            runApp();
                                        }
                                    });
                            }});

                        },
                        function (error) {alert("Error creando tabla exceptions_to_delivery. " + error.message);}
                    );
                });
            }
        };
        try{
            create_table.exceptions_to_pickup();
        }catch (e){alert(e.message);}
    }


    function runApp(){
        try{
        SettingsModel.get({
            success: function(tx, results){
                Settings.setSettings(results._first);
            }
        });
        initializeApp();
        }catch (e){ alert('RunApp:  '+e.message); }
    }



    function construct(){//Función que controla cuales son los metodos publicos
        return {
            run    : run,
        }
    }
    return {construct:construct};//retorna los metodos publicos
})().construct();

/*
    if(!MigrationModel.migrationWasExecuted(1)){
        Default_calculatorModel.insertOrUpdate({empty: true});
        MigrationModel.store(1, 'Se crea colección para valores por defecto de la calculadora.');
        console.log('Migration 1 executed');
    }

    if(!MigrationModel.migrationWasExecuted(2)){
        Default_emailModel.insertOrUpdate({empty: true});
        MigrationModel.store(2, 'Se crea colección para valores por defecto de la calculadora.');
        console.log('Migration 2 executed');
    }
});*/