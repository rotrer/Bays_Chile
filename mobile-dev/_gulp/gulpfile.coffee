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
clean          = require("gulp-clean")
browserSync    = require("browser-sync")
gulpStripDebug = require("gulp-strip-debug")
lr             = require("tiny-lr")
livereload     = require("gulp-livereload")
server         = lr()

# paths
src          = "src"
dest         = "../assets/"
destPhonegap = "../../www/www/assets/"

#
#  gulp tasks
#  ==========================================================================


# clean
gulp.task "clean", ->
  gulp.src [
    dest + "/scripts/*.*"
    dest + "/styles/*.*"
    dest + "/img/*.*"
    dest + "*.html"
  ]
  .pipe clean()

#copy js scripts app
gulp.task "copy-ionic", ->
  gulp.src [
    "bower_components/ionic/release/**"
  ]
  #.pipe uglify()
  .pipe gulp.dest dest + "scripts/ionic"
#copy js scripts app
gulp.task "copy-html", ->
  gulp.src [
    src + "/html/**/*.html"
  ]
  .pipe gulp.dest "../"
  .pipe livereload(server)
# copy libs scritps
gulp.task "copy-libs", ->
  gulp.src [
    "bower_components/jquery/jquery.min.js"
    "bower_components/underscore/underscore-min.js"
  ]
  .pipe gulp.dest dest + "scripts"
#copy js scripts app
gulp.task "copy-js", ->
  gulp.src [
    src + "/scripts/*.js"
  ]
  #.pipe uglify()
  .pipe gulp.dest dest + "scripts"
  .pipe livereload(server)
#copy imgs appp
gulp.task "copy-img", ->
  gulp.src [
    src + "/images/*"
  ]
  .pipe gulp.dest dest + "img"
#copy styles app
gulp.task "copy-styles", ->
  gulp.src [
    src + "/styles/*"
  ]
  .pipe gulp.dest dest + "styles"
#copy fonts app
gulp.task "copy-fonts", ->
  gulp.src [
    src + "/fonts/*"
  ]
  .pipe gulp.dest dest + "fonts"

# coffee
# gulp.task "coffee", ->
#   gulp.src src + "/scripts/**/*.coffee"
#   .pipe coffee
#     bare: true
#   .pipe concat("scripts.js")
#   .pipe gulp.dest dest + "/scripts"
#   .pipe livereload(server)

# # scripts
# gulp.task "scripts", ->
#   gulp.src [
#     "bower_components/detectizr/src/detectizr.js"
#     "bower_components/H5F/src/H5F.js"
#     "bower_components/slick-carousel/slick/slick.js"
#     "bower_components/jquery.html5loader/src/jquery.html5Loader.js"
#     "bower_components/scroll-depth/jquery.scrolldepth.js"
#     "bower_components/boba/site/js/boba.js"
#     dest + "/scripts/scripts.js"
#   ]
#   .pipe concat "scripts.js"
#   .pipe gulp.dest dest + "/scripts"

# # scripts-dist
# gulp.task "scripts-dist",["coffee"], ->
#   gulp.src [
#     !src + "/vendor/scripts/plugins/_*.js"
#     src + "/vendor/scripts/plugins/*.js"
#     dest + "/scripts/scripts.js"
#   ]
#   .pipe concat "scripts.js"
#   .pipe gulpStripDebug()
#   .pipe uglify()
#   .pipe gulp.dest dest + "/scripts"

# # styles
# gulp.task "styles", ->
#   gulp.src src + "/styles/styles.scss"
#   .pipe plumber()
#   .pipe sass
#     sourceComments: "normal"
#     errLogToConsole: false
#     onError: (err) -> notify().write(err)
#   .pipe autoprefixer("last 15 version")
#   .pipe gulp.dest dest + "/styles"
#   .pipe livereload(server)

# # styles-dist
# gulp.task "styles-dist",  ->
#   gulp.src src + "/styles/styles.scss"
#   .pipe plumber()
#   .pipe sass()
#   .on "error", notify.onError()
#   .on "error", (err) ->
#     console.log "Error:", err
#   .pipe autoprefixer("last 15 version")
#   .pipe minifycss
#     keepSpecialComments: 0
#   .pipe gulp.dest dest + "/styles"
#copy js scripts app
gulp.task "copy-ionic-p", ->
  gulp.src [
    "bower_components/ionic/release/**"
  ]
  #.pipe uglify()
  .pipe gulp.dest destPhonegap + "scripts/ionic"
#copy html scripts app
gulp.task "copy-html-p", ->
  gulp.src [
    src + "/html/**/*.html"
  ]
  .pipe gulp.dest "../../www/www/"
  .pipe livereload(server)
# copy libs scritps
gulp.task "copy-libs-p", ->
  gulp.src [
    "bower_components/jquery/jquery.min.js"
    "bower_components/underscore/underscore-min.js"
  ]
  .pipe gulp.dest destPhonegap + "scripts"
#copy js scripts app
gulp.task "copy-js-p", ->
  gulp.src [
    src + "/scripts/*.js"
  ]
  #.pipe uglify()
  .pipe gulp.dest destPhonegap + "scripts"
  .pipe livereload(server)
#copy imgs appp
gulp.task "copy-img-p", ->
  gulp.src [
    src + "/images/*"
  ]
  .pipe gulp.dest destPhonegap + "img"
#copy styles app
gulp.task "copy-styles-p", ->
  gulp.src [
    src + "/styles/*"
  ]
  .pipe gulp.dest destPhonegap + "styles"
#copy fonts app
gulp.task "copy-fonts-p", ->
  gulp.src [
    src + "/fonts/*"
  ]
  .pipe gulp.dest destPhonegap + "fonts"

gulp.task 'watch', ->
  gulp.watch [src + '/scripts/*.js'], ['copy-js']
  gulp.watch [src + '/html/**/*.html'], ['copy-html']
  gulp.watch [src + '/images/*'], ['copy-img']
  gulp.watch [src + '/styles/*'], ['copy-styles']
  # gulp.watch [src + '/styles/**/*.scss'], ['styles']
  # gulp.watch [src + "/vendor/scripts/plugins/*.js"], ['scripts']

#
#  main tasks
#  ==========================================================================

# default task
gulp.task 'default', [
  "copy-html"
  "copy-ionic"
  "copy-libs"
  "copy-js"
  "copy-img"
  "copy-styles"
  "copy-fonts"
  "watch"
]

# dev phonegap task
gulp.task 'phonegap', [
  "copy-html-p"
  "copy-ionic-p"
  "copy-libs-p"
  "copy-js-p"
  "copy-img-p"
  "copy-styles-p"
  "copy-fonts-p"
  "watch"
]
