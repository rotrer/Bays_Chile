# include gulp
gulp           = require("gulp")

# include our plugins
# sass           = require("gulp-sass")
shell          = require("gulp-shell")
plumber        = require("gulp-plumber")
notify         = require("gulp-notify")
minifycss      = require("gulp-minify-css")
autoprefixer   = require("gulp-autoprefixer")
concat         = require("gulp-concat")
rename         = require("gulp-rename")
uglify         = require("gulp-uglify")
coffee         = require("gulp-coffee")
cache          = require("gulp-cached")
browserSync    = require("browser-sync")
gulpStripDebug = require("gulp-strip-debug")
lr             = require("tiny-lr")
livereload     = require("gulp-livereload")
connect        = require("gulp-connect")
server         = lr()

# paths
src          = "source"
dest         = "mobile-dev/"
destPhonegap = "app/www/"

#
#  gulp tasks
#  ==========================================================================

#copy html app
gulp.task "copy-html", ->
  gulp.src [
    src + "/html/**/*.html"
  ]
  .pipe gulp.dest dest
  .pipe connect.reload()
# copy libs scritps
gulp.task "copy-libs", ->
  gulp.src [
    "bower_components/jquery/jquery.min.js"
    "bower_components/angular/angular.min.js"
    "bower_components/angular-route/angular-route.min.js"
    src + "/lib/app-js.v1.js"
  ]
  .pipe gulp.dest dest + "assets/lib"
#copy js scripts app
gulp.task "copy-js", ->
  gulp.src [
    src + "/scripts/*.js"
  ]
  #.pipe uglify()
  .pipe gulp.dest dest + "assets/scripts"
  .pipe connect.reload()
#copy imgs appp
gulp.task "copy-img", ->
  gulp.src [
    src + "/images/*"
  ]
  .pipe gulp.dest dest + "assets/img"
  .pipe connect.reload()
#copy styles app
gulp.task "copy-styles", ->
  gulp.src [
    src + "/styles/*"
  ]
  .pipe gulp.dest dest + "assets/styles"
  .pipe connect.reload()
#copy fonts app
gulp.task "copy-fonts", ->
  gulp.src [
    src + "/fonts/*"
  ]
  .pipe gulp.dest dest + "assets/styles/font"
  .pipe connect.reload()

gulp.task "webserver", ->
  connect.server
    livereload: true
    # port: 80
    # host: "bays.app"
    root: "mobile-dev"


#
# Phonegap Developer
# ====================
#
#copy html app
gulp.task "copy-html-p", ->
  gulp.src [
    src + "/html/**/*.html"
  ]
  .pipe gulp.dest destPhonegap
  .pipe connect.reload()
# copy libs scritps
gulp.task "copy-libs-p", ->
  gulp.src [
    "bower_components/jquery/jquery.min.js"
    "bower_components/angular/angular.min.js"
    "bower_components/angular-route/angular-route.min.js"
    src + "/lib/app-js.v1.js"
  ]
  .pipe gulp.dest destPhonegap + "assets/lib"
#copy js scripts app
gulp.task "copy-js-p", ->
  gulp.src [
    src + "/scripts/*.js"
  ]
  #.pipe uglify()
  .pipe gulp.dest destPhonegap + "assets/scripts"
  .pipe connect.reload()
#copy imgs appp
gulp.task "copy-img-p", ->
  gulp.src [
    src + "/images/*"
  ]
  .pipe gulp.dest destPhonegap + "assets/img"
  .pipe connect.reload()
#copy styles app
gulp.task "copy-styles-p", ->
  gulp.src [
    src + "/styles/*"
  ]
  .pipe gulp.dest destPhonegap + "assets/styles"
  .pipe connect.reload()
#copy fonts app
gulp.task "copy-fonts-p", ->
  gulp.src [
    src + "/fonts/*"
  ]
  .pipe gulp.dest destPhonegap + "assets/styles/font"
  .pipe connect.reload()

gulp.task "webserver-p", ->
  connect.server
    livereload: true
    # port: 80
    # host: "bays.app"
    root: "mobile-dev"

gulp.task 'watch', ->
  gulp.watch [src + '/scripts/*.js'], ['copy-js']
  gulp.watch [src + '/html/**/*.html'], ['copy-html']
  gulp.watch [src + '/images/*'], ['copy-img']
  gulp.watch [src + '/styles/*'], ['copy-styles']

gulp.task 'watch-p', ->
  gulp.watch [src + '/scripts/*.js'], ['copy-js-p']
  gulp.watch [src + '/html/**/*.html'], ['copy-html-p']
  gulp.watch [src + '/images/*'], ['copy-img-p']
  gulp.watch [src + '/styles/*'], ['copy-styles-p']



#
# Dist task
# ====================
# 
#copy js scripts app
#copy html app
gulp.task "copy-html-dist", ->
  gulp.src [
    src + "/html/**/*.html"
  ]
  .pipe gulp.dest destPhonegap
# copy libs scritps
gulp.task "copy-libs-dist", ->
  gulp.src [
    "bower_components/jquery/jquery.min.js"
    "bower_components/angular/angular.min.js"
    "bower_components/angular-route/angular-route.min.js"
    src + "/lib/app-js.v1.js"
  ]
  .pipe gulp.dest destPhonegap + "assets/lib"
#copy js scripts app
gulp.task "copy-js-dist", ->
  gulp.src [
    src + "/scripts/*.js"
  ]
  .pipe uglify({mangle: false})
  .pipe gulpStripDebug()
  .pipe gulp.dest destPhonegap + "assets/scripts"
#copy imgs appp
gulp.task "copy-img-dist", ->
  gulp.src [
    src + "/images/*"
  ]
  .pipe gulp.dest destPhonegap + "assets/img"
#copy styles app
gulp.task "copy-styles-dist", ->
  gulp.src [
    src + "/styles/*"
  ]
  .pipe minifycss()
  .pipe gulp.dest destPhonegap + "assets/styles"
#copy fonts app
gulp.task "copy-fonts-dist", ->
  gulp.src [
    src + "/fonts/*"
  ]
  .pipe gulp.dest destPhonegap + "assets/styles/font"




#
#  main tasks
#  ==========================================================================

# default task
gulp.task 'default', [
  "copy-html"
  "copy-libs"
  "copy-js"
  "copy-img"
  "copy-styles"
  "copy-fonts"
  "watch"
  "webserver"
]

# dev phonegap task
gulp.task 'phonegap', [
  "copy-html-p"
  "copy-libs-p"
  "copy-js-p"
  "copy-img-p"
  "copy-styles-p"
  "copy-fonts-p"
  "watch-p"
  "webserver-p"
]

# dev phonegap task
gulp.task 'dist', [
  "copy-html-dist"
  "copy-libs-dist"
  "copy-js-dist"
  "copy-img-dist"
  "copy-styles-dist"
  "copy-fonts-dist"
]
