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

        window.DatecsPrinter.write('Hola');
        window.DatecsPrinter.writeHex("" +
            "00000000  1b 40 48 65 6c 6c 6f 20  77 6f 72 6c 64 0a 1d 56  |.@Hello world..V|\n" +
            "00000010  41 03                                             |A.|\n" +
            "00000012"
        );
        window.DatecsPrinter.writeHex("00000000  1b 40 48 65 6c 6c 6f 20  77 6f 72 6c 64 0a 1d 56  |.@Hello world..V|00000010  41 03                                             |A.|00000012");
        window.DatecsPrinter.printPage();
        return false;


        window.DatecsPrinter.printBarcode(
            69, //here goes the barcode type code
            App.operations.current_pickup.pickup_number, //your barcode data
            function() {},
            function() {alert('Error: '+JSON.stringify(error));}
        );
        window.DatecsPrinter.feedPaper(3);
        //printImage('/images/savne_net.png');
        window.DatecsPrinter.printText('{reset}', 'ISO-8859-1');
        window.DatecsPrinter.printText('             SAVNE ', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(2);
        window.DatecsPrinter.printText(' Recoleccion numero: '+App.operations.current_pickup.pickup_number, 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Valor: '+accounting.formatMoney(App.operations.current_pickup.value), 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Firma cliente', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(3);
        window.DatecsPrinter.printText(' ______________________', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText('      '+MomentUtility_.now(), 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText('  ', 'ISO-8859-1');
        window.DatecsPrinter.printBarcode(
            69, //here goes the barcode type code
            1223456, //your barcode data
            function() {},
            function() {alert('Error: '+JSON.stringify(error));}
        );
        window.DatecsPrinter.printBarcode(
            69, //here goes the barcode type code
            App.operations.current_pickup.pickup_number, //your barcode data
            function() {},
            function() {alert('Error: '+JSON.stringify(error));}
        );
        window.DatecsPrinter.feedPaper(3);
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
        window.DatecsPrinter.feedPaper(3);
        printImage('/images/savne_net.png');
        window.DatecsPrinter.printText('           SAVNE ', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(2);
        window.DatecsPrinter.printText(' Entrega numero: '+App.operations.current_delivery.delivery_number, 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Valor: '+accounting.formatMoney(App.operations.current_delivery.value), 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText(' Firma cliente', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(3);
        window.DatecsPrinter.printText(' ______________________', 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText('      '+MomentUtility_.now(), 'ISO-8859-1');
        window.DatecsPrinter.feedPaper(1);
        window.DatecsPrinter.printText('  ', 'ISO-8859-1');
        window.DatecsPrinter.printBarcode(
            69, //here goes the barcode type code
            App.operations.current_delivery.delivery_number, //your barcode data
            function() {},
            function() {alert('Error: '+JSON.stringify(error));}
        );
        window.DatecsPrinter.feedPaper(3);
    };

    function printImage(path) {
        var image = new Image();
        image.src = path;
        image.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.height = 100;
            canvas.width = 100;
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            var imageData = canvas.toDataURL('image/jpeg').replace(/^data:image\/(png|jpg|jpeg);base64,/, ""); //remove mimetype
            alert(imageData);
            window.DatecsPrinter.printImage(
                imageData, //base64
                canvas.width,
                canvas.height,
                1,
                function() {},
                function(error) {
                    alert(JSON.stringify(error));
                }
            )
        };
    }



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
