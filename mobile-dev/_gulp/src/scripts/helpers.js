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
    alert(dataNotif);
    console.log(dataNotif);
    window.plugin.notification.local.add(dataNotif);
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
        nowTmp = new Date().getTime(),
        dateNotif = new Date(nowTmp + 5*1000);
        addNotifBay('first', 'Test Ng', 'Testing Ng Notifications', null, dateNotf);
    }
};
app.initialize();