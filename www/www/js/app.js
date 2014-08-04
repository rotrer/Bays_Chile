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

        //Admob
        initAd();
        window.plugins.AdMob.createBannerView();
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
        //localStorage.setItem('firstTimeLoad', 'ok');
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
    $('.fail').append(error.code);
}

function createTableTides(fechas){
    var items = [];

    //Init table
    $.each(fechas.data, function (key, val) {
        if (key == '2014-07' || key == '2014-08') {
            $.each(val, function (keyDay, valDay) {
                var mes = keyDay.split("-");
                var mesInt = parseInt(mes[1]);
                var today = new Date();
                var mm = today.getMonth()+1;
                if (mesInt == mm) {
                    items.push(
                        '<div class="ui-grid-solo">',
                            '<div class="ui-block-a">' + keyDay + '</div>',
                        '</div>'
                    );
                    items.push(
                        '<div class="ui-grid-c">',
                            '<div class="ui-block-a"><div class="ui-bar ui-bar-a"><p>' + valDay.h1st + '</p><p>' + valDay.m1st + ' ' + valDay.t1st + '</p></div></div>',
                            '<div class="ui-block-b"><div class="ui-bar ui-bar-a"><p>' + valDay.h2nd + '</p><p>' + valDay.m2nd + ' ' + valDay.t2nd + '</p></div></div>',
                            '<div class="ui-block-c"><div class="ui-bar ui-bar-a"><p>' + valDay.h3rd + '</p><p>' + valDay.m3rd + ' ' + valDay.t3rd + '</p></div></div>'
                    );

                    if (valDay.hasOwnProperty("h4th")) {
                        items.push(
                                '<div class="ui-block-d"><div class="ui-bar ui-bar-a"><p>' + valDay.h4th + '</p><p>' + valDay.m4th + ' ' + valDay.t4th + '</p></div></div>'
                        );
                    } else {
                        items.push(
                                '<div class="ui-block-d"><div class="ui-bar ui-bar-a">&nbsp;</div></div>'
                        );
                    }

                    items.push(
                        '</div>'
                    );
                }
            });
        }
    });

    $("#dataBaySelected").empty().append( items.join("") );
}

function initAd(){
    if ( window.plugins && window.plugins.AdMob ) {
        //var admob_ios_key = 'ca-app-pub-6869992474017983/4806197152';
        var admob_android_key = 'ca-app-pub-6734101457930625/5847725395';
        //var admobid = (( /(android)/i.test(navigator.userAgent) ) ? admob_android_key : admob_ios_key);
        window.plugins.AdMob.setOptions( {
            publisherId: admob_android_key,
            bannerAtTop: false, // set to true, to put banner at top
            overlap: false, // set to true, to allow banner overlap webview
            offsetTopBar: false, // set to true to avoid ios7 status bar overlap
            isTesting: true, // receiving test ad
            autoShow: true // auto show interstitial ad when loaded
        });

        //registerAdEvents();

    } else {
        alert( 'admob plugin not ready' );
    }
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