(function($) {
    "use strict";

    $( document ).on( "deviceready", function(){
        StatusBar.overlaysWebView( false );
        StatusBar.backgroundColorByName("gray");

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, fail);

        //Configuraciones usuarios
        $('#saveSettings').on('click', saveSettings);
    });
}
)(jQuery);

var fSys;
function onRequestFileSystemSuccess(fileSystem) {
    fSys = fileSystem;
    //Primera carga de datos
    if (localStorage.getItem('firstTimeLoad') === null) {
        localStorage.setItem('firstTimeLoad', 'ok');
        alert('Primera');
        firstLoadApp();
    } else {
        alert('Carga local');
        firstLoadBays();
    }
}

function firstLoadApp() {
    var uri;
    var entry;
    var basePathTides;

    basePathTides = fSys.root.toURL();
    entry = fSys.root;
    entry.getDirectory("tide-chile", {create: true, exclusive: false});
    entry.getFile("tide-chile/bays.json", {create: true, exclusive: false}, function(fileEntry){
        var ft;
        var localPath;
        localPath = basePathTides + fileEntry.fullPath.replace('//', '');
        fileEntry.remove();

        ft = new FileTransfer();
        uri = 'http://tides.rotrer.com/bays/bays.json';

        ft.download(
            uri,
            localPath,
            firstLoadBays,
            fail,
            false
        );
    }, fail);
}

function loadBayByName(bayName) {

}

function firstLoadBays(){
    var entry;

    entry = fSys.root;
    entry.getFile("tide-chile/bays.json", null, function(fileEntry){
        fileEntry.file(function(file){
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                var bays = JSON.parse(evt.target.result);
                var items = [];
                $.each( bays.bays, function( key, val ) {
                    items.push('<li><a href="' + key +'">' + val.toUpperCase() +'</a></li>');
                });
                $("#list_bays").empty().append( items.join("") ).listview( "refresh" );
//                $('.write').append(items.join( "" ));
            };
            reader.readAsText(file);
        }, fail);
    }, fail);
}

var saveSettings = function() {
    try {
        var tipPct = parseFloat( $('#tipPercentage').val() );
        localStorage.setItem('tipPercentage', tipPct);
        tipPercent = tipPct;
        window.history.back();
    } catch (ex) {
        alert('Tip percentage must be a decimal value');
    }
};

function fail(error) {
    alert(error.code);
    $('.fail').append(error.code);
}

//function gotFileEntry(fileEntry) {
//    fileEntry.createWriter(gotFileWriter, fail);
//}
//
//function gotFileWriter(writer) {
//    writer.onwriteend = function(evt) {
//        $('.write').append("contents of file now 'some sample text'");
//        writer.truncate(11);
//        writer.onwriteend = function(evt) {
//            $('.write').append("contents of file now 'some sample'");
//            writer.seek(4);
//            writer.write(" different text");
//            writer.onwriteend = function(evt){
//                $('.write').append("contents of file now 'some different text'");
//            }
//        };
//    };
//    writer.onerror = function (evt) {
//        fail(evt);
//    }
//    writer.write("some sample text");
//}
//
//var tipPercent = 15.0;
//
//var calcTip = function() {
//    var billAmt = Number( $('#billAmount').val() );
//    var tipAmt =  billAmt * tipPercent/100 ;
//    var totalAmt = billAmt + tipAmt;
//    $('#tipAmount').text('$' + tipAmt.toFixed(2));
//    $('#totalAmount').text('$' + totalAmt.toFixed(2));
//};
//
//var saveSettings = function() {
//    try {
//        var tipPct = parseFloat( $('#tipPercentage').val() );
//        localStorage.setItem('tipPercentage', tipPct);
//        tipPercent = tipPct;
//        window.history.back();
//    } catch (ex) {
//        alert('Tip percentage must be a decimal value');
//    }
//};
//
//$( document ).on( "ready", function(){
//    $('#calcTip').on('click', calcTip);
//    $('#saveSettings').on('click', saveSettings);
//    var tipPercentSetting = localStorage.getItem('tipPercentage');
//    if (tipPercentSetting) {
//        tipPercent = parseFloat(tipPercentSetting);
//    }
//    $('#tipPercentage').val(tipPercent);
//});