(function($) {
    "use strict";

    $( document ).on( "deviceready", function(){
        StatusBar.overlaysWebView( false );
        StatusBar.backgroundColorByName("gray");

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, fail);
        //Admob
        //initAd();
        //window.plugins.AdMob.createBannerView();
    });

    //Configuraciones usuarios
    $('#saveSettings').on('click', saveSettings);
    
    // custom css expression for a case-insensitive contains()
    jQuery.expr[':'].Contains = function(a,i,m){
        return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
    };
    //Search bar
    listFilter($("#list_bays"));

    window.addEventListener('toggle', function(evt){
        var bayID = $.urlParam('bayid');
        if ($("#" + evt.target.id).hasClass('active')) {
            favManager(bayID ,true);
        } else {
            favManager(bayID ,false);
        }
    });

    window.addEventListener('push', pageChanged);
}
)(jQuery);

var fSys;
var baseApiUtl = 'http://tides.rotrer.com/bays/';

function onRequestFileSystemSuccess(fileSystem) {
    fSys = fileSystem;
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
        uri = baseApiUtl + 'bays.json';

        ft.download(
            uri,
            localPath,
            firstLoadBays,
            fail,
            false
        );
    }, fail);
}

function firstLoadBays(){
    var entry;

    entry = fSys.root;
    entry.getFile("tide-chile/bays.json", null, function(fileEntry){
        fileEntry.file(function(file){
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                var bays = JSON.parse(evt.target.result);
                var baysSort = bays.bays.sort();
                var items = [];
                $.each( baysSort, function( key, val ) {
                    // items.push('<li><a class="baySelect" data-transition="slide" href="#bayPage" rel="' + val +'">' + val.toUpperCase() +'</a></li>');
                    items.push('<li class="table-view-cell"><a data-transition="slide-in" class="push-right baySelect" href="bay.html?bayid=' + val +'"><strong>' + val.toUpperCase() +'</strong></a></li>');
                });
                $("#list_bays").empty().append( items.join("") );
            };
            reader.readAsText(file);
        }, fail);
    }, fail);
}

function loadBayByName(bayName) {
    var uri;
    var entry;
    var basePathTides;

    basePathTides = fSys.root.toURL();
    entry = fSys.root;
    entry.getDirectory('tide-chile', {create: true, exclusive: false});
    entry.getFile('tide-chile/' + bayName +'.json', {create: true, exclusive: false}, function(fileEntry){
        
        //Check file exists
        fileEntry.file(function(fileObj) {
            sizeJson = fileObj.size;
            if (sizeJson !== 0 ) {
                createTableTides(fileObj);
            } else {
                var ft;
                var localPath;
                localPath = basePathTides + fileEntry.fullPath.replace('//', '');
                ft = new FileTransfer();
                uri = baseApiUtl + bayName +'.json';

                ft.download(
                    uri,
                    localPath,
                    function(){
                        entry.getFile('tide-chile/' + bayName +'.json', null, function(fileEntry){
                            fileEntry.file(function(file){
                                createTableTides(file);
                            }, fail);
                        }, fail);
                    },
                    fail,
                    false
                );
            }
        });
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
    console.log(error.code);
}

function createTableTides(file){
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        var fechas = JSON.parse(evt.target.result);
        var scrollDivDay = '';
        var todayClass = '';
        var items = [];
        /*
        * Calcula fase lunar, arreglo correcion mes
        */
        var fixMonth = { "m1": 0, "m2": 1, "m3": 0, "m4": 1, "m5": 2, "m6": 3, "m7": 4, "m8": 5, "m9": 6, "m10": 7, "m11": 8, "m12": 9 };
        var moonPhase = { "nm" : "Luena Nueva", "fq" : "Cuarto Creciente", "fm" : "Luna Llena", "lq" : "Cuarto Menguante"};
       
        //Init table
        $.each(fechas.data, function (key, val) {
            if (key === '2014-07' || key === '2014-08') {
                $.each(val, function (keyDay, valDay) {
                    var dateTide = keyDay.split("-");
                    var mesInt = parseInt(dateTide[1]);
                    var dayInt = parseInt(dateTide[0]);
                    var today = new Date();
                    var mm = today.getMonth()+1;
                    
                    if (mesInt === mm) {
                        /*
                        * Calcula fase lunar
                        */
                        var monthCorr = "m" + mesInt;
                        var nroAureo = (parseInt(dateTide[2]) + 1) % 19;
                        var epacta = (nroAureo - 1) * 99;
                        var edadLunar = epacta + parseInt(fixMonth[monthCorr]) + dayInt;
                        var moonPhaseDay = '';
                        //Correción si es mayor a 30 edad lunar
                        if (edadLunar > 30)
                            edadLunar = edadLunar - 30;
                        
                        //Fases Lunares según edad lunar
                        if (edadLunar >= 0 && edadLunar <= 6) {
                            moonPhaseDay = moonPhase.nm;
                        } else if (edadLunar >= 7 && edadLunar <= 13) {
                            moonPhaseDay = moonPhase.fq;
                        } else if (edadLunar >= 14 && edadLunar <= 21) {
                            moonPhaseDay = moonPhase.fm;
                        } else if (edadLunar >= 22) {
                            moonPhaseDay = moonPhase.lq;
                        }
                        
                        if (today.getDate() === dayInt) {
                            todayClass = "today_tide";
                            scrollDivDay = 'day_' + dayInt;
                        } else {
                            todayClass = "";
                        }
                        items.push(
                            '<li class="table-view-cell table-view-divider ' + todayClass + '" id="day_' + dayInt +'"><h5 class="pull-left">' + keyDay + '</h5><h6 class="pull-right">' + moonPhaseDay + '</h6></li>'
                        );
                            items.push(
                                '<li class="table-view-cell">',
                                    '<span class="pull-left" style="width:25%">' + valDay.h1st + '<p>' + valDay.m1st + ' ' + valDay.t1st + '</p></span>',
                                    '<span class="pull-left" style="width:25%">' + valDay.h2nd + '<p>' + valDay.m2nd + ' ' + valDay.t2nd + '</p></span>',
                                    '<span class="pull-left" style="width:25%">' + valDay.h3rd + '<p>' + valDay.m3rd + ' ' + valDay.t3rd + '</p></span>'
                            );

                            if (valDay.hasOwnProperty("h4th")) {
                                items.push(
                                    '<span class="pull-right" style="width:25%">' + valDay.h4th + '<p>' + valDay.m4th + ' ' + valDay.t4th + '</p></span>'
                                );
                            } else {
                                items.push(
                                    '<span class="pull-right" style="width:25%">&nbsp;<p>&nbsp;</p></span>'
                                );
                            }
                        items.push(
                            '</li>'
                        );
                    }
                });
            }
        });

        $("#dataBaySelected").empty().append( items.join("") );
        //$.mobile.silentScroll( $('#' + scrollDivDay).offset().top );
        
    };
    reader.readAsText(file);
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

function pageChanged(evt){
    if (window.location.pathname.indexOf('favorites.html') !== -1) {
        loadFavorites();    
    }
    if (window.location.pathname.indexOf('bay.html') !== -1) {
        var bayID = $.urlParam('bayid');
        if (bayID !== null) {
            loadBayByName(bayID);

            if (localStorage.getItem('baysFav') !== null) {
                var favBays = JSON.parse(localStorage.getItem('baysFav'));
                if (favBays.bays.indexOf(bayID) !== -1) {
                    $("#fav_togg").addClass("active");
                }
            }
        } else {
            alert("Error: Bahía no existe.");
        }
    }
    if (window.location.pathname.indexOf('index.html') !== -1) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, fail);       
    }
}

function favManager(bayID, addOrRemove){
    // alert(bayID + addOrRemove);
    var favBays = localStorage.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('baysFav'));
    if (addOrRemove === true) {
        favBays.bays.push(bayID);
    } else {
        favBays.bays.remove(bayID);
    }
    localStorage.setItem('baysFav', JSON.stringify(favBays));
}

function loadFavorites(){
    if (localStorage.getItem('baysFav') !== null) {
        var favBays = JSON.parse(localStorage.getItem('baysFav'));
        var favSort = favBays.bays.sort();
        var items = [];
        $.each( favSort, function( key, val ) {
            items.push('<li class="table-view-cell"><a data-transition="slide-in" class="push-right baySelect" href="bay.html?bayid=' + val +'"><strong>' + val.toUpperCase() +'</strong></a></li>');
        });
        $("#list_bays").empty().append( items.join("") );
    }
}

function listFilter(list) { // header is any element, list is an unordered list
    $(".filterinput")
        .change( function () {
            var filter = $(this).val();
            if(filter) {
              // this finds all links in a list that contain the input,
              // and hide the ones not containing the input while showing the ones that do
              $(list).find("a:not(:Contains(" + filter + "))").parent().slideUp();
              $(list).find("a:Contains(" + filter + ")").parent().slideDown();
            } else {
              $(list).find("li").slideDown();
            }
            return false;
          })
        .keyup( function () {
            // fire the above change event after every letter
            $(this).change();
        });
}

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results === null){
       return null;
    }
    else{
       return results[1] || 0;
    }
};

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};