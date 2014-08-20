Ionic - Angular
===========

- Clonar repo

```sh
cd mobile-dev/_gulp
npm install
bower install
```

Para desarrollo solo app mobile
----
```sh
gulp
```

Para desarrollo solo app phonegap
----
```sh
gulp phonegap
```

Agregar plataforma android
----

- En raíz proyecto
```sh
cordova platform android
```

Instalar plugins
----

- En raíz proyecto
```sh
  cordova plugin add org.apache.cordova.device
  cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file.git
  cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file-transfer.git
  cordova plugin add org.apache.cordova.statusbar
  cordova plugin add de.appplant.cordova.plugin.local-notification && cordova prepare
  cordova plugin add com.google.admobsdk-googleplay
```