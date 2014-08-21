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