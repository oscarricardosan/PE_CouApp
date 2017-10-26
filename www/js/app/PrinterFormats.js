var PrinterFormat= (function () {

    var pickup_label= function() {
        /*window.DatecsPrinter.feedPaper(3);
        window.DatecsPrinter.printText('             SAVNE ', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(2);
        window.DatecsPrinter.printText(' Recolección número: '+App.operations.current_pickup.pickup_number, 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Valor: '+accounting.formatMoney(App.operations.current_pickup.value), 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Firma cliente', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(3);
        window.DatecsPrinter.printText(' ______________________', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText('      '+MomentUtility_.now(), 'ISO-8859-1');
        window.DatecsPrinter.printText('  ', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printBarcode(
            69, //here goes the barcode type code
            App.operations.current_pickup.pickup_number, //your barcode data
            function() {},
            function() {alert('Error: '+JSON.stringify(error));}
        );
        window.DatecsPrinter.feedPaper(3);*/

        format="^XA";
        format+= "^FX Top section with company logo, name and address.";
        format+= "^CF0,25";
        format+= "^FO190,20^FDSAVNE^FS";
        format+= "^FO20,55^FD Recolección Numero: "+App.operations.current_pickup.pickup_number+" ^FS";
        format+= "^FO20,95^FD Valor: "+accounting.formatMoney(App.operations.current_pickup.value)+"^FS";
        format+= "^FO20,130^FD Firma cliente:  ^FS";
        format+= "^FO20,180^FD____________________________________________^FS";
        format+= "^BY3,1,40";
        format+= "^FO80,200^BC^FD"+App.operations.current_pickup.pickup_number+"^FS";

        format+= "^CF0,19";
        format+= "^FO337,255^FD"+MomentUtility_.now()+"^FS";
        format+= "^XZ";
        window.DatecsPrinter.printText(format, 'ISO-8859-1');

    };

    var pickup_delivery= function() {
        /*
        window.DatecsPrinter.feedPaper(3);
        window.DatecsPrinter.printText('             SAVNE ', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(2);
        window.DatecsPrinter.printText(' Entrega número: '+App.operations.current_delivery.delivery_number, 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Valor: '+accounting.formatMoney(App.operations.current_delivery.value), 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Firma cliente', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(3);
        window.DatecsPrinter.printText(' ______________________', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText('      '+MomentUtility_.now(), 'ISO-8859-1');
        window.DatecsPrinter.printText('  ', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printBarcode(
            69, //here goes the barcode type code
            App.operations.current_delivery.delivery_number, //your barcode data
            function() {},
            function() {alert('Error: '+JSON.stringify(error));}
        );
        window.DatecsPrinter.feedPaper(3);
        */

        format="^XA";
        format+= "^FX Top section with company logo, name and address.";
        format+= "^CF0,25";
        format+= "^FO190,20^FDSAVNE^FS";
        format+= "^FO20,55^FD Entrega Numero: "+App.operations.current_delivery.delivery_number+" ^FS";
        format+= "^FO20,95^FD Valor: "+accounting.formatMoney(App.operations.current_delivery.value)+"^FS";
        format+= "^FO20,130^FD Firma cliente:  ^FS";
        format+= "^FO20,180^FD____________________________________________^FS";
        format+= "^BY3,1,40";
        format+= "^FO80,200^BC^FD"+App.operations.current_delivery.delivery_numbe+"^FS";

        format+= "^CF0,19";
        format+= "^FO337,255^FD"+MomentUtility_.now()+"^FS";
        format+= "^XZ";
        window.DatecsPrinter.printText(format, 'ISO-8859-1');

    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            pickup_label            : pickup_label,
            pickup_delivery         : pickup_delivery
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
