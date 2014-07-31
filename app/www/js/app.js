(function($) {
    "use strict";

    $( document ).on( "deviceready", function(){
        StatusBar.overlaysWebView( false );
        StatusBar.backgroundColorByName("gray");

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, fail);

        //Configuraciones usuarios
        $('#saveSettings').on('click', saveSettings);

        //Bahía selccionada
        $(document).on('click', '.baySelect', function(){
            var selBay = $(this).attr("rel");
            //Titulo bahía
            $("#tit_lugar").empty().text( $(this).text() + ' - Mareas Chile' );
            //Loading
            $.mobile.loading( "show", {
                text: "Cargando",
                textVisible: false,
                theme: $.mobile.loader.prototype.options.theme,
                textonly: false,
                html: ""
            });
            //Cargar bahía
            loadBayByName(selBay);
            $("#dataBaySelected").empty().text( selBay );
        });
    });
}
)(jQuery);

var fSys;
function onRequestFileSystemSuccess(fileSystem) {
    fSys = fileSystem;
    //Loading
    showLoadingApp();
    //Primera carga de datos
    if (localStorage.getItem('firstTimeLoad') === null) {
        localStorage.setItem('firstTimeLoad', 'ok');
        firstLoadApp();
    } else {
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
    //Hide loading
    hideLoadingApp();
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
                    items.push('<li><a class="baySelect" data-transition="slide" href="#bayPage" rel="' + val +'">' + val.toUpperCase() +'</a></li>');
                });
                $("#list_bays").empty().append( items.join("") ).listview( "refresh" );
            };
            reader.readAsText(file);
        }, fail);
    }, fail);
    //Hide loading
    hideLoadingApp();
}

function loadBayByName(bayName) {
    var uri;
    var entry;
    var basePathTides;

    basePathTides = fSys.root.toURL();
    entry = fSys.root;
    entry.getDirectory('tide-chile', {create: true, exclusive: false});
    entry.getFile('tide-chile/' + bayName +'.json', {create: true, exclusive: false}, function(fileEntry){
        var ft;
        var localPath;
        localPath = basePathTides + fileEntry.fullPath.replace('//', '');

        ft = new FileTransfer();
        uri = 'http://tides.rotrer.com/bays/' + bayName +'.json';

        ft.download(
            uri,
            localPath,
            function(){
                entry.getFile('tide-chile/' + bayName +'.json', null, function(fileEntry){
                    fileEntry.file(function(file){
                        var reader = new FileReader();
                        reader.onloadend = function(evt) {
                            var fechas = JSON.parse(evt.target.result);
                            createTableTides(fechas);
                            //Hide loading
                            hideLoadingApp();
                        };
                        reader.readAsText(file);
                    }, fail);
                }, fail);
            },
            fail,
            false
        );
    }, fail);
}

function saveSettings() {
    try {
        var tipPct = parseFloat( $('#tipPercentage').val() );
        localStorage.setItem('tipPercentage', tipPct);
        tipPercent = tipPct;
        window.history.back();
    } catch (ex) {
        alert('Tip percentage must be a decimal value');
    }
}

function showLoadingApp(){
    setTimeout(function(){
        $.mobile.loading('show');
    },1);
}

function hideLoadingApp(){
    setTimeout(function(){
        $.mobile.loading('hide');
    },300);
}

function fail(error) {
    alert(error.code);
    $('.fail').append(error.code);
}

function createTableTides(fechas){
    var items = [];
    $.each(fechas.data, function (key, val) {
        if (key == '2014-07' || key == '2014-08') {
            $.each(val, function (keyDay, valDay) {
                var fecha = new Date(keyDay*1000);
                var dia = fecha.getDate();
                var mes = parseInt(fecha.getMonth()) + 1;
                var anno = fecha.getFullYear();
                var formattedTime = dia + '/' + mes + '/' + anno;

                if (mes == 7) {
                    <table data-role="table" id="movie-table-custom" data-mode="reflow" class="movie-list">
                        <thead>
                            <tr>
                                <th data-priority="1">Rank</th>
                                <th style="width:40%">Movie Title</th>
                                <th data-priority="2">Year</th>
                                <th data-priority="3"><abbr title="Rotten Tomato Rating">Rating</abbr></th>
                                <th data-priority="4">Reviews</th>
                                <th data-priority="4">Director</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>1</th>
                                <td class="title"><a href="http://en.wikipedia.org/wiki/Citizen_Kane" data-rel="external">Citizen Kane</a></td>
                                <td>1941</td>
                                <td>100%</td>
                                <td>74</td>
                                <td>Orson Welles</td>
                            </tr>
                        </tbody>
                    </table>
                    $("#dataBaySelected").append('<p>'+ formattedTime +'</p>');
                }
            });
        }
    });
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