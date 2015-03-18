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

function setNotifMoonPhase(state){  
  //Si activa las notificaciones de cambio luna
  if (state === true) {
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
        epacta = (nroAureo - 1) * 11;
    
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
    angular.forEach(scheduledIds, function(val, key) {
      if (val.indexOf("moon_") !== -1) {
        cancelNotifByID(val);
      }
    });
  });
}

function setNotifBaysWeekend(bayId, bayName){
    /*
     * 
     * Si activa las notificaciones de fin de semana por bahía
     */
    var now = new Date(),//Fecha base
        yearCurrent = now.getFullYear(),//Año actual
        monthCurrent = now.getMonth(),//Mes actual
        monthCurrentAdd1 = monthCurrent + 1,//Mes actual más uno
        dayCurrent = now.getDate(),//Día actual
        qtyDaysCurrentMmonth = new Date(yearCurrent, monthCurrentAdd1, 0).getDate(),//Cantidad dias mes actual
        notifNameWeekend = '';//Para definir nombre notificación

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
            notifNameWeekend = 'bay_' + bayId + '_' + i + '_' + monthCurrent;
            var diaNombre = '';
            if (dayCurrentMonth.getDay() === 6)
              diaNombre = 'Sábado';
            else
              diaNombre = 'Domingo';
            
            var titleNotifWeekend = 'Mareas Chile.';
            var messageNotifWeekend = 'Revisa las mareas para mañana ' + diaNombre + ', en la localidad de ' + bayName.toUpperCase();
            var dataNotif = JSON.stringify({type: 'weekend', bay: bayId, day: i, month: monthCurrent});
            var dateOffset = 6*60*60*1000;
            var dateNotif = new Date(yearCurrent, monthCurrent, i);
                dateNotif.setTime(dateNotif.getTime() - dateOffset);
            addNotifBay(notifNameWeekend, titleNotifWeekend, messageNotifWeekend,  dataNotif, dateNotif);
          }
        }
}

function deleteAllNotifWeekend(){
  window.plugin.notification.local.getScheduledIds( function (scheduledIds) {
    angular.forEach(scheduledIds, function(val, key) {
      if (val.indexOf("bay_") !== -1) {
        cancelNotifByID(val);
      }
    });
  });
}

function deleteNotifWeekendByBay(bayId){
  window.plugin.notification.local.getScheduledIds( function (scheduledIds) {
    angular.forEach(scheduledIds, function(val, key) {
      if (val.indexOf(bayId) !== -1) {
        cancelNotifByID(val);
      }
    });
  });
}

function cancelNotifByID(id){
  window.plugin.notification.local.cancel(id);
}

function notifScheduledLog(){
  window.plugin.notification.local.getScheduledIds( function (scheduledIds) {
    // console.log('Scheduled IDs: ' + scheduledIds.join(' ,'));
  });
}

function initGA(){
    //Track an open event
    analytics.trackEvent('App', 'Open', 'App', new Date());

    /*
     * 
     * Home links bahías
     */
    $(document).on('click', '.baySelect', function(){
      var bayName = $(this).attr("data-bay");
      analytics.trackView('bay/' + bayName);
    });

    /*
     * 
     * Favorites links bahías
     */
    $(document).on('click', '.baySelectFavs', function(){
      var bayName = $(this).attr("data-bay");
      analytics.trackEvent('Fav', 'Click', 'Add ' + bayName, 1);
    });
    $(document).on('click', '.baySelectFavsDelete', function(){
      var bayName = $(this).attr("data-bay");
      analytics.trackEvent('Fav', 'Click', 'Add ' + bayName, 1);
    });

    /*
     * 
     * Menu links
     */
    $(document).on('click', '#navHome', function(){
      analytics.trackView('/home');
    });
    $(document).on('click', '#navFavs', function(){
      analytics.trackView('/favorites');
    });
    $(document).on('click', '#navConf', function(){
      analytics.trackView('/settings');
    });

    /*
     * 
     * Settings touchs
     */
    $(document).on('click', '.moonPhaseNotif', function(){
        analytics.trackEvent('Button', 'Click', 'Toggle notif moon phase', new Date());
    });
    $(document).on('click', '.weekendNotif', function(){
        analytics.trackEvent('Button', 'Click', 'Toggle notif weekend', new Date());
    });
}
document.addEventListener('deviceready', function() {
  // StatusBar.overlaysWebView( false );
  // StatusBar.backgroundColorByName("gray");

  //GA
  var analyticsAccount = "UA-34567136-3";
  analytics.startTrackerWithId(analyticsAccount);
  initGA();
  //Notificaciones event listener
  window.plugin.notification.local.onclick = function (id, state, json) {
    var dataNotif = JSON.parse(json);
    if (dataNotif.type === 'weekend') {
      if (dataNotif.bay !== null) {
        localS.setItem('currentBay', dataNotif.bay);
      } else {
          alert("Error: Bahía no existe.");
      }
    }
  };
}, false);
