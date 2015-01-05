Angular + Onsen UI
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
cd app
mkdir plugins
mkdir platforms
cordova platform add android
```

Instalar plugins
----

- En raíz proyecto
```sh
  cordova plugin add org.apache.cordova.device
  cordova plugin add https://github.com/katzer/cordova-plugin-local-notifications.git
  cordova plugin add com.google.admobsdk-googleplay
  cordova plugin add https://github.com/danwilson/google-analytics-plugin.git
```