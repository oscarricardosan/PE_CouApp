var FormUtility_= (function () {

    var asignaValByName = function(data, contenedor, prefijo, sufijoName, arrayname ) {
        if(typeof(prefijo)=="boolean"){
            arrayname = contenedor;
            prefijo = '';
        }
        if(prefijo===undefined)prefijo='';
        if(arrayname===undefined)arrayname=false;
        var arrayname_str='';
        if(arrayname)arrayname_str='[]';
        if(sufijoName===undefined)sufijoName='';
        $.each(data, function(name, value ){
            var selector = contenedor+' [name'+sufijoName+'="'+prefijo+name+arrayname_str+'"]';
            var typeElemn = $(selector).prop('nodeName');
            var element = $(selector);
            if(element.length>0){
                if($.inArray(typeElemn, ['INPUT', 'SELECT'])!=-1){
                    element.val(value);
                    if($.inArray(typeElemn, ['SELECT'])!=-1)
                        if(element.is('[materialize]'))
                            element.material_select();
                }
                if($.inArray(typeElemn, ['DIV','H4'])!=-1) element.html(value);
                if(!element.hasClass('typeahead')){
                    inactivo = element.attr('disabled')=='disabled';
                    if(inactivo)element.removeAttr('disabled');
                    element.focus(); element.blur();
                    if(inactivo)element.attr('disabled','disabled');
                }
            }
        });
    };

    var namesToId = function(element) {
        if(element===undefined)element='body';
        $(element).find('[name]').each(function(index, element){
            var idElemento = $(this).attr('id');
            var nameElemento = $(this).attr('name');
            if(idElemento==undefined){
                if(nameElemento.search(/\[]/)==-1){
                    $(this).attr('id', nameElemento);
                }else{
                    $(this).attr('id', nameElemento.replace(/\[]/, '_'+$('[name="'+nameElemento+'"][id] ').length));
                }
            }
        });
    };

    var idToName = function(element) {
        if(element===undefined)element='body';
        $(element).find('[id]').each(function(index, element){
            if($(this).attr('name')==undefined)
                $(this).attr('name',$(this).attr('id'));
        });
    };

    /**
     * Find by Id in array
     * @param array
     * @param id
     */
    var findById = function (array, id) {
        return _.findWhere(array, {id: id*1});
    };

    var limpiarForm = function (contenedor, except) {
        if(except==undefined)except='.select-dropdown, input[name="_token"]';
        else except+=' ,.select-dropdown, input[name="_token"]';
        $(contenedor).find('input:not('+except+')').val('');
        $(contenedor).find('textarea:not('+except+')').val('');
        $(contenedor).find('select:not('+except+')').val('');
    };


    function serialized_data_to_json(serialized_data){
        var jsonObj = {};
        jQuery.map( serialized_data, function( n, i ) {
            jsonObj[n.name] = n.value;
        });

        return jsonObj;
    }

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            asignaValByName           : asignaValByName,
            idToName                  : idToName,
            findById                  : findById,
            limpiarForm               : limpiarForm,
            namesToId                 : namesToId,
            serialized_data_to_json   : serialized_data_to_json,
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
