var PrinterFormat= (function () {

    var pickup_label= function(type){
        switch (type){
            case 'ZPL':
                pickup_label_ZPL(); //http://labelary.com/viewer.html
                break;
            case 'TXT':
                pickup_label_TXT();
                break;
            default:
                alert('Tipo '+type+' para impresión no valido');
                break;
        }
    };

    var delivery_label= function(type){
        switch (type){
            case 'ZPL':
                delivery_label_ZPL(); //http://labelary.com/viewer.html
                break;
            case 'TXT':
                delivery_label_TXT();
                break;
            default:
                alert('Tipo '+type+' para impresión no valido');
                break;
        }
    };

    var pickup_label_ZPL= function() {
        format="^XA";
        format+= "^FX Top section with company logo, name and address.";
        format+= "^CF0,23";
        format+= "^FO140,16^FDSAVNE - DEMO ^FS";
        format+= "^FO0,43^FD Recoleccion Numero: "+App.operations.current_pickup.pickup_number+" ^FS";
        format+= "^FO0,73^FD Valor: "+accounting.formatMoney(App.operations.current_pickup.value)+"^FS";
        format+= "^FO0,100^FD Firma cliente:  ^FS";
        format+= "^FO0,150^FD ____________________________________________ ^FS";
        format+= "^BY2,1,40";
        format+= "^FO0,180^BC^FD"+App.operations.current_pickup.pickup_number+"^FS";

        format+= "^CF0,18";
        format+= "^FO200,255^FD"+MomentUtility_.now()+"^FS";
        format+= "^XZ";
        window.DatecsPrinter.printText(format, 'ISO-8859-1');
    };

    var pickup_label_TXT= function() {
        //Ancho de hoja 32 caracteres
        window.DatecsPrinter.feedPaper(1);window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.feedPaper(1);window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText('             SAVNE ', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(2);
        window.DatecsPrinter.printText(' Recoleccion numero: '+App.operations.current_pickup.pickup_number, 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Contenido: '+App.operations.current_pickup.content, 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Valor: '+accounting.formatMoney(App.operations.current_pickup.value), 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Firma cliente', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.feedPaper(1);window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' ________________________________', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText('             '+MomentUtility_.now(), 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText('  ', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.feedPaper(1);window.DatecsPrinter.feedPaper(1);
    };

    var delivery_label_ZPL= function() {
        format="^XA";
        format+= "^FX Top section with company logo, name and address.";
        format+= "^CF0,23";
        format+= "^FO140,16^FDSAVNE - DEMO ^FS";
        format+= "^FO0,43^FD Entrega Numero: "+App.operations.current_delivery.delivery_number+" ^FS";
        format+= "^FO0,73^FD Valor: "+accounting.formatMoney(App.operations.current_delivery.value)+"^FS";
        format+= "^FO0,100^FD Firma cliente:  ^FS";
        format+= "^FO0,150^FD____________________________________________^FS";
        format+= "^BY2,1,40";
        format+= "^FO0,180^BC^FD"+App.operations.current_delivery.delivery_number+"^FS";

        format+= "^CF0,18";
        format+= "^FO200,255^FD"+MomentUtility_.now()+"^FS";
        format+= "^XZ";
        window.DatecsPrinter.printText(format, 'ISO-8859-1');

    };

    var delivery_label_TXT= function() {
        window.DatecsPrinter.feedPaper(1);window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.feedPaper(1);window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText('             SAVNE ', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(2);
        window.DatecsPrinter.printText(' Entrega numero: '+App.operations.current_delivery.delivery_number, 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Contenido: '+App.operations.current_delivery.content, 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Valor: '+accounting.formatMoney(App.operations.current_delivery.value), 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Firma cliente', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.feedPaper(1);window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' ________________________________', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText('             '+MomentUtility_.now(), 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText('  ', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.feedPaper(1);window.DatecsPrinter.feedPaper(1);

        /*window.DatecsPrinter.printBarcode(
            69, //here goes the barcode type code
            App.operations.current_delivery.delivery_number, //your barcode data
            function() {},
            function() {alert('Error: '+JSON.stringify(error));}
        );*/
    };


    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            pickup_label                : pickup_label,
            delivery_label              : delivery_label,
            pickup_label_ZPL            : pickup_label_ZPL,
            pickup_label_TXT            : pickup_label_TXT,
            delivery_label_ZPL          : delivery_label_ZPL,
            delivery_label_TXT          : delivery_label_TXT
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
