(function($) {
    "use strict";

    $( document ).on( "deviceready", function(){
        showLoadingApp();
        StatusBar.overlaysWebView( false );
        StatusBar.backgroundColorByName("gray");

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, fail);
        //Admob
        //initAd();
        //window.plugins.AdMob.createBannerView();
        
        //Manejar eventos de notificaciones
        notifEvents();
    });

    //Configuraciones usuarios
    $(document).on('submit', '#settings_data', saveSettings);
    
    // custom css expression for a case-insensitive contains()
    jQuery.expr[':'].Contains = function(a,i,m){
        return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
    };
    //Search bar
    listFilter($("#list_bays"));

    window.addEventListener('toggle', function(evt){
        if (evt.target.id === "fav_togg") {
            var bayID = $.urlParam('bayid');
            favManager(bayID ,$("#" + evt.target.id).hasClass('active'));
        } else if (evt.target.id === "weekend_togg") {
            var activeNotWeekend = $("#weekend_togg").hasClass('active') === true ? 'active' : '';
            $("#weekend").val(activeNotWeekend);
            loadBaysNotification(activeNotWeekend);
        } else if (evt.target.id === "moon_phase_togg") {
            var activeNotMoonPhase = $("#moon_phase_togg").hasClass('active') === true ? 'active' : '';
            $("#moon_phase").val(activeNotMoonPhase);
        } else if ($(evt.target).hasClass('notifBaySel') === true) {
            notifBayManager($(evt.target).attr('rel') ,$(evt.target).hasClass('active'));
        }
    });
    
    window.addEventListener('push', pageChanged);
}
)(jQuery);

var fSys, allCurrentNotifs,
    notifBaysToRemove = { "bays" : [] },
    notifBaysToSave = { "bays" : [] },
    isNotifRunning = false,
    baseApiUtl = 'http://tides.rotrer.com/bays/';

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
                if (isNotifRunning === false) hideLoadingApp();
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

function saveSettings(evt) {
    evt.preventDefault();
    try {
        $(".settings_form").fadeOut("fast", function(){
            $(".preload").fadeIn();
            setTimeout(function(){
                $(".preload").fadeOut("fast", function(){
                    $(".settings_form").fadeIn();
                });
            }, 1000); 
        });
        //Configurar notificaciones cambio de luna
        setNotifMoonPhase();
        //Configurar notificaciones bahis fines de semana
        setNotifBaysWeekend();
        //window.history.back();
    } catch (ex) {
        alert('Error al guardar configuración');
    }
}

function showLoadingApp(){
    $(".card").fadeOut("fast", function(){
        $(".preload").fadeIn(); 
    });
}

function hideLoadingApp(){
    setTimeout(function(){
        $(".preload").fadeOut("fast", function(){
            $(".card").fadeIn();
        });
    }, 700);
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
        var moonPhase = { "nm" : ["Nueva", "new_moon.png"], "fq" : ["Creciente", "first_quarter.png"], "fm" : ["Llena", "full_moon.png"], "lq" : ["Menguante", "last_quarter.png"]};
       
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
                        var moonPhaseDayImg = '';
                        //Correción si es mayor a 30 edad lunar
                        if (edadLunar > 30)
                            edadLunar = edadLunar - 30;
                        
                        //Fases Lunares según edad lunar
                        if (edadLunar >= 0 && edadLunar <= 6) {
                            moonPhaseDay = moonPhase.nm[0];
                            moonPhaseDayImg = moonPhase.nm[1];
                        } else if (edadLunar >= 7 && edadLunar <= 13) {
                            moonPhaseDay = moonPhase.fq[0];
                            moonPhaseDayImg = moonPhase.fq[1];
                        } else if (edadLunar >= 14 && edadLunar <= 21) {
                            moonPhaseDay = moonPhase.fm[0];
                            moonPhaseDayImg = moonPhase.fm[1];
                        } else if (edadLunar >= 22) {
                            moonPhaseDay = moonPhase.lq[0];
                            moonPhaseDayImg = moonPhase.lq[1];
                        }
                        
                        //Destacar dia actual de marea
                        if (today.getDate() === dayInt) {
                            todayClass = "today_tide";
                            scrollDivDay = '#day_' + dayInt;
                        } else {
                            todayClass = "";
                        }
                        items.push(
                            '<li class="table-view-cell table-view-divider media ' + todayClass + '" id="day_' + dayInt +'">',
                                '<img class="media-object pull-right icon-moon" src="img/' + moonPhaseDayImg + '">',
                                '<div class="media-body"><h5 class="pull-left">' + keyDay + '</h5><h6 class="pull-right">' + moonPhaseDay + '</h6></div>',
                            '</li>'
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
    if (window.location.pathname.indexOf('index.html') !== -1) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, fail);       
    }
    
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
    
    if (window.location.pathname.indexOf('settings.html') !== -1) {
        //Obtener las notificaciones configuradas
        notifScheduled();
        //Vaciar bahias notificacion
        notifBaysToSave = { "bays" : [] };
        notifBaysToRemove = { "bays" : [] };
        if (localStorage.getItem('weekend') !== null) {
            $("#weekend_togg").addClass(localStorage.getItem('weekend'));
            $('#weekend').val(localStorage.getItem('weekend'));
            loadBaysNotification(localStorage.getItem('weekend'));
        }
        if (localStorage.getItem('moon_phase') !== null) {
            $("#moon_phase_togg").addClass(localStorage.getItem('moon_phase'));
            $('#moon_phase').val(localStorage.getItem('moon_phase'));
        }
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

function loadBaysNotification(state){
    if (state === 'active') {
        var entry;

        entry = fSys.root;
        entry.getFile("tide-chile/bays.json", null, function(fileEntry){
            fileEntry.file(function(file){
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    var bays = evt.target.result === '' ? null : JSON.parse(evt.target.result);
                    var baysSort = bays.bays.sort();
                    var notifBays = localStorage.getItem('notifBays') === null ? null : JSON.parse(localStorage.getItem('notifBays'));
                    var items = [];
                    var activeNotifBay = '';
                    $.each( baysSort, function( key, val ) {
                        //Activar toggles de notificaciones por bahi
                        if (notifBays !== null){
                            activeNotifBay = notifBays.bays.indexOf(val) !== -1 ? 'active' : '';
                        }
                        items.push('<li class="table-view-cell">');
                            items.push(val.toUpperCase());
                            items.push('<div class="toggle notifBaySel '+ activeNotifBay +'" rel="' + val +'">');
                                items.push('<div class="toggle-handle"></div>');
                            items.push('</div>');
                        items.push('</li>');
                    });
                    $("#notif_bays_list").empty().append( items.join("") );
                };
                reader.readAsText(file);
            }, fail);
        }, fail);
        $("#notif_bays").slideDown();
    } else {
        $("#notif_bays").slideUp();
    }
}

function notifBayManager(bayID, addOrRemove){
    if (addOrRemove === true) {
        notifBaysToSave.bays.push(bayID);
        notifBaysToRemove.bays.remove(bayID);
    } else {
        notifBaysToSave.bays.remove(bayID);
        notifBaysToRemove.bays.push(bayID);
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

function setNotifMoonPhase(){
    var state = $('#moon_phase').val();
    localStorage.setItem('moon_phase', state);
    
    //Si activa las notificaciones de cambio luna
    if (state === 'active') {        
        //Nuevas notificaciones
        /*
        * Calcula fase lunar, arreglo correcion mes
        */
        var now = new Date(),//Fecha base
            yearCurrent = now.getFullYear(),//Año actual
            monthCurrent = now.getMonth(),//Mes actual
            monthCurrentAdd1 = monthCurrent + 1,//Mes actual más uno, para correción mes calcula edad lunar
            dayCurrent = now.getDate(),//Día actual
            qtyDaysCurrentMmonth = new Date(yearCurrent, monthCurrentAdd1, 0).getDate(),//Cantidad dias mes actual
            notificationsMoon = { nm: [], fq: [], fm: [], lq: [] },//Objeto para verificar para no repetir notificaciones
            moonPhase = { "nm" : ["Luna Nueva", "nueva"], "fq" : ["Cuarto Creciente", "creciente"], "fm" : ["Luna Llena", "llena"], "lq" : ["Cuarto Menguante", "menguante"]},//Fase lunares
            fixMonth = { "m1": 0, "m2": 1, "m3": 0, "m4": 1, "m5": 2, "m6": 3, "m7": 4, "m8": 5, "m9": 6, "m10": 7, "m11": 8, "m12": 9 },//Correlacion meses fase lunar
            nroAureo = (parseInt(yearCurrent) + 1) % 19,
            epacta = (nroAureo - 1) * 99;
        
        //Calcular fase de la luna por mes actual
        for (var i = dayCurrent; i <= qtyDaysCurrentMmonth; i++) {
            var edadLunar = epacta + parseInt(fixMonth["m" + monthCurrentAdd1]) + i;//Calculo edad lunar
            var moonPhaseDay = 'moon_';//Prefijo para notificaciones fase lunar
            //Correción si es mayor a 30 edad lunar
            if (edadLunar > 30)//Corrección si edad lunar es mayor a 30
                edadLunar = edadLunar - 30;

            //Textos futuros y actuales
            if (dayCurrent !== i) {
                var cambioStr = 'Cambio de fase lunar',
                    cicloStr = 'Hoy comienza el ciclo de ',
                    dateNotif = new Date(yearCurrent, monthCurrent, i, 8, 0);
            } else {
                var cambioStr = 'Fase lunar actual',
                    cicloStr = 'Ciclo de ',
                    nowTmp = new Date().getTime(),
                    dateNotif = new Date(nowTmp + 300*1000);
            }
            //Fases Lunares según edad lunar
            //Luna nueva
            if (edadLunar >= 0 && edadLunar <= 6) {
                if (notificationsMoon.nm.length === 0){//Agrega notificacion sino el arreglo esta vacio
                    moonPhaseDay += moonPhase.nm[1];
                    notificationsMoon.nm.push(moonPhaseDay);
                    addNotifBay(moonPhaseDay, cambioStr, cicloStr + moonPhase.nm[0],  null, dateNotif);
                }
            //Cuarto creciente
            } else if (edadLunar >= 7 && edadLunar <= 13) {//Agrega notificacion sino el arreglo esta vacio
                if (notificationsMoon.fq.length === 0){
                    moonPhaseDay += moonPhase.fq[1];
                    notificationsMoon.fq.push(moonPhaseDay);
                    addNotifBay(moonPhaseDay, cambioStr, cicloStr + moonPhase.fq[0],  null, dateNotif);
                }
            //Luna llena
            } else if (edadLunar >= 14 && edadLunar <= 21) {//Agrega notificacion sino el arreglo esta vacio
                if (notificationsMoon.fm.length === 0){
                    moonPhaseDay += moonPhase.fm[1];
                    notificationsMoon.fm.push(moonPhaseDay);
                    addNotifBay(moonPhaseDay, cambioStr, cicloStr + moonPhase.fm[0],  null, dateNotif);
                }
            //Cuarto menguante
            } else if (edadLunar >= 22) {//Agrega notificacion sino el arreglo esta vacio
                if (notificationsMoon.lq.length === 0){
                    moonPhaseDay += moonPhase.lq[1];
                    notificationsMoon.lq.push(moonPhaseDay);
                    addNotifBay(moonPhaseDay, cambioStr, cicloStr + moonPhase.lq[0],  null, dateNotif);
                }
            }
        }
    //Si desactiva las notificaciones de cambio d eluna
    } else {
        deleteNotifMoonPhase();
    }
}

function deleteNotifMoonPhase(){
    window.plugin.notification.local.getScheduledIds( function (scheduledIds) {
        $.each(scheduledIds, function (key, val) {
            if (val.indexOf("moon_") !== -1) {
                cancelNotifByID(val);
            }
        });
    });
}

function setNotifBaysWeekend(){
    /*
     * 
     * Se activa/desactiva toggle notificaciones
     */
    var state = $('#weekend').val();
    localStorage.setItem('weekend', state);
    /*
     * 
     * Guardar configuraciones de notificaciones
     */
    localStorage.setItem('notifBays', JSON.stringify(notifBaysToSave));
    /*
     * 
     * Si activa las notificaciones de fin de semana
     */
    if (state === 'active') {
        var notifBays = JSON.parse(localStorage.getItem('notifBays')),
            now = new Date(),//Fecha base
            yearCurrent = now.getFullYear(),//Año actual
            monthCurrent = now.getMonth(),//Mes actual
            monthCurrentAdd1 = monthCurrent + 1,//Mes actual más uno
            dayCurrent = now.getDate(),//Día actual
            qtyDaysCurrentMmonth = new Date(yearCurrent, monthCurrentAdd1, 0).getDate(),//Cantidad dias mes actual
            notifNameWeekend = '';//Para definir nombre notificación
        if (notifBays.bays.length > 0) {
            $.each(notifBays.bays, function (key, baySelected) {
                for (var i = dayCurrent; i <= qtyDaysCurrentMmonth; i++) {
                    var dayCurrentMonth = new Date(yearCurrent, monthCurrent, i),//Revisa si el dia del mes actual es fin de semana
                        isWeekend = (dayCurrentMonth.getDay() === 6) || (dayCurrentMonth.getDay() === 0);
                    if (isWeekend === true) {
                        /*
                         * Composicion nombre notificacion por bahi/dia fin de semana es
                         * prefijo: nombre bahia
                         * dia: dia fin de semana de notificacion
                         * mes: mes actual
                         * Ejemplo: valparaiso_7_8
                         */
                        notifNameWeekend = 'bay_' + baySelected + '_' + i + '_' + monthCurrent;
                        //Verifica se existe notificacion por bahia/dia ya agendada, si es verdadero la elimina
                        if (allCurrentNotifs.indexOf(notifNameWeekend) === -1) {
                            var diaNombre = '';
                            if (dayCurrentMonth.getDay() === 6)
                                diaNombre = 'Sábado';
                            else
                                diaNombre = 'Domingo';
                            
                            var titleNotifWeekend = 'Mareas Chile.';
                            var messageNotifWeekend = 'Revisa las mareas para mañana ' + diaNombre + ', en la localidad de ' + baySelected.toUpperCase();
                            var dataNotif = JSON.stringify({type: 'weekend', bay: baySelected, day: i, month: monthCurrent});
                            var dateOffset = 6*60*60*1000;
                            var dateNotif = new Date(yearCurrent, monthCurrent, i);
                                dateNotif.setTime(dateNotif.getTime() - dateOffset);
                            addNotifBay(notifNameWeekend, titleNotifWeekend, messageNotifWeekend,  dataNotif, dateNotif);
                        }
                        
                    }
                }
            });
        }
        /*
         * 
         * Eliminar notificaciones de bahias desactivadas
         */
        deleteNotifWeekend(false);
    } else {
    /*
     * 
     * Elimina todas las notificaciones de las bahias y resetea toggles
     */
        deleteNotifWeekend(true);
        localStorage.setItem('notifBays', JSON.stringify({ "bays" : [] }));
    }
}

function deleteNotifWeekend(all){
    window.plugin.notification.local.getScheduledIds( function (scheduledIds) {
        if (all === true) {
            $.each(scheduledIds, function (key, val) {
                if (val.indexOf("bay_") !== -1) {
                    cancelNotifByID(val);
                }
            });
        } else {
            $.each(notifBaysToRemove.bays, function (keyBay, valBay) {
                $.each(scheduledIds, function (key, val) {
                    if (val.indexOf(valBay) !== -1) {
                        cancelNotifByID(val);
                    }
                });
            });
        }
    });
}
function notifEvents(){
    window.plugin.notification.local.oncancel = function (id, state, json) {
        //console.log('Cancel ID: ' + id + ' state: ' + state);
        //console.log(json);
    };
    window.plugin.notification.local.onclick = function (id, state, json) {
        //console.log(id, JSON.parse(json).test);
        var dataNotif = JSON.parse(json);
        if (dataNotif.type === 'weekend') {
            if (dataNotif.bay !== null) {
                isNotifRunning = true;
                showLoadingApp();
                setTimeout(function(){
                    $('.baySelect').each(function( index ) {
                        if ($(this).attr('href').indexOf(dataNotif.bay) !== -1){
                            $("#list_bays").hide();
                            $(".response_notif").empty().html('<h3>' + dataNotif.bay.toUpperCase() + '</h3><ul class="table-view" id="dataBaySelected">');
                            loadBayByName(dataNotif.bay);
                            hideLoadingApp();
                        }
                    });
                    isNotifRunning = false;
                }, 1500);
                //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, fail);
                //var hHref = 'bay.html?bayidNotif=' + dataNotif.bay;
            } else {
                alert("Error: Bahía no existe.");
            }
        }
    };
    window.plugin.notification.local.onadd = function (id, state, json) {
        //console.log('Scheduled IDs: ' + id + ' state: ' + state);
        //console.log(json);
    };
}

function notifScheduledLog(){
    window.plugin.notification.local.getScheduledIds( function (scheduledIds) {
        console.log('Scheduled IDs: ' + scheduledIds.join(' ,'));
    });
}

function noitfIsScheduled(id){
    window.plugin.notification.local.isScheduled(id, function (isScheduled) {
        console.log('Notification with ID ' + id + ' is scheduled: ' + isScheduled);
    });
}

function notifScheduled(){
    window.plugin.notification.local.getScheduledIds( function (scheduledIds) {
        allCurrentNotifs = scheduledIds;
    });
}

function cancelNotifByID(id){
    window.plugin.notification.local.cancel(id);
}

function addNotifBay(id, title, message, json, dateNotf){
    var dataNotif = {
        id:         id,
        title:      title,
        message:    message,
        autoCancel: true
    };
    
    if (json !== null)
        dataNotif.json = json;
    
    if (dateNotf !== null)
        dataNotif.date = dateNotf;
    
    window.plugin.notification.local.add(dataNotif);
}

function nows(){
    var now = new Date();
    console.log(now);
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
