var Migrations= (function () {

    var run= function(){
        DB.transaction(function(transaction) {
            transaction.executeSql('CREATE TABLE IF NOT EXISTS migrations (id integer primary key, version integer, desc text)', [],
                function(tx, result) {
                    MigrationModel.get_version({
                        success: function(tx, results){
                            if(results._first.version === null){
                                run_migration_0();
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
                        'CREATE TABLE IF NOT EXISTS settings (id integer primary key, domain text, url_server text)', [],
                        function (tx, result) {create_table.setting_printer();},
                        function (error) {alert("Error creando tabla settings. " + error.message);}
                    );
                });
            },
            setting_printer: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS setting_printer (id integer primary key, address text, type text)', [],
                        function (tx, result) {create_table.setting_gps();},
                        function (error) {alert("Error creando tabla setting_printer. " + error.message);}
                    );
                });
            },
            setting_gps: function(){
                DB.transaction(function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS setting_gps (id integer primary key, lat text, long text)', [],
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
                        'data text, created_at text, transmit_only_with_WiFi text' +
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
                        function (tx, result) {create_table.pickups();},
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
                            'obs text, state text, city text, val text, content text, lat text, long text' +
                            'state_id integer, consignments text' +
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
                            'obs text, state text, city text, val text, content text, lat text, long text' +
                            'state_id integer, consignments text' +
                        ')',
                        [],
                        function (tx, result) {
                            MigrationModel.insert({
                                id: 1,
                                version: 1,
                                desc: 'Migracion inicial'
                            }, {
                                success: function(){
                                    runApp();
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


    function runApp(){
        SettingsModel.get({
            success: function(tx, results){
                Settings.setSettings(results._first);
            }
        });
        initializeApp();
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