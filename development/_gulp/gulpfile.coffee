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
dest         = "../../public/"
dirAssets    = "assets/"
destPhonegap = "../../app/www/assets/"

#
#  gulp tasks
#  ==========================================================================

#copy js scripts app
gulp.task "copy-onsen-css", ->
  gulp.src [
    "bower_components/onsenui/build/css/**"
  ]
  #.pipe uglify()
  .pipe gulp.dest dest + dirAssets + "scripts/onsen/css"
gulp.task "copy-onsen-js", ->
  gulp.src [
    "bower_components/onsenui/build/js/onsenui_all.js"
  ]
  #.pipe uglify()
  .pipe gulp.dest dest + dirAssets + "scripts/onsen/js"
#copy js scripts app
gulp.task "copy-html", ->
  gulp.src [
    src + "/html/**/*.html"
  ]
  .pipe gulp.dest dest
  .pipe livereload(server)
# copy libs scritps
gulp.task "copy-libs", ->
  gulp.src [
    "bower_components/jquery/jquery.min.js"
    "bower_components/underscore/underscore-min.js"
  ]
  .pipe gulp.dest dest + dirAssets + "scripts"
#copy js scripts app
gulp.task "copy-js", ->
  gulp.src [
    src + "/scripts/*.js"
  ]
  #.pipe uglify()
  .pipe gulp.dest dest + dirAssets + "scripts"
  .pipe livereload(server)
#copy imgs appp
gulp.task "copy-img", ->
  gulp.src [
    src + "/images/*"
  ]
  .pipe gulp.dest dest + dirAssets + "img"
#copy styles app
gulp.task "copy-styles", ->
  gulp.src [
    src + "/styles/*"
  ]
  .pipe gulp.dest dest + dirAssets + "styles"
#copy fonts app
gulp.task "copy-fonts", ->
  gulp.src [
    src + "/fonts/*"
  ]
  .pipe gulp.dest dest + dirAssets + "fonts"

#
# Dist task
# ====================
# 
#copy js scripts app
gulp.task "copy-onsen-css-dist", ->
  gulp.src [
    "bower_components/onsenui/build/css/ionicons/**"
  ]
  .pipe gulp.dest destPhonegap + "scripts/onsen/css/ionicons"
  gulp.src [
    "bower_components/onsenui/build/css/font_awesome/**"
  ]
  .pipe gulp.dest destPhonegap + "scripts/onsen/css/font_awesome"
gulp.task "copy-onsen-css-min-dist", ->
  gulp.src [
    "bower_components/onsenui/build/css/*.css"
  ]
  # .pipe minifycss
  .pipe gulp.dest destPhonegap + "scripts/onsen/css"
gulp.task "copy-onsen-js-dist", ->
  gulp.src [
    "bower_components/onsenui/build/js/onsenui_all.js"
  ]
  .pipe uglify()
  .pipe gulp.dest destPhonegap + "scripts/onsen/js"
#copy html scripts app
gulp.task "copy-html-dist", ->
  gulp.src [
    src + "/html/**/*.html"
  ]
  .pipe gulp.dest "../../app/www/"

#copy js scripts app
gulp.task "copy-js-dist", ->
  gulp.src [
    src + "/scripts/*.js"
  ]
  .pipe uglify({mangle: false})
  .pipe gulpStripDebug()
  .pipe gulp.dest destPhonegap + "scripts"

  gulp.src [
    "bower_components/jquery/jquery.min.js"
  ]
  .pipe gulp.dest destPhonegap + "scripts"
#copy imgs appp
gulp.task "copy-img-dist", ->
  gulp.src [
    src + "/images/*"
  ]
  .pipe gulp.dest destPhonegap + "img"
#copy styles app
gulp.task "copy-styles-dist", ->
  gulp.src [
    src + "/styles/*"
  ]
  .pipe minifycss
  .pipe gulp.dest destPhonegap + "styles"
#copy fonts app
gulp.task "copy-fonts-dist", ->
  gulp.src [
    src + "/fonts/*"
  ]
  .pipe gulp.dest destPhonegap + "fonts"


gulp.task 'watch', ->
  gulp.watch [src + '/scripts/*.js'], ['copy-js']
  gulp.watch [src + '/html/**/*.html'], ['copy-html']
  gulp.watch [src + '/images/*'], ['copy-img']
  gulp.watch [src + '/styles/*'], ['copy-styles']

#
#  main tasks
#  ==========================================================================

# default task
gulp.task 'default', [
  "copy-html"
  "copy-onsen-css"
  "copy-onsen-js"
  "copy-js"
  "copy-img"
  "copy-styles"
  "copy-fonts"
  "watch"
]

# dev phonegap task
gulp.task 'dist', [
  "copy-html-dist"
  "copy-onsen-css-dist"
  "copy-onsen-css-min-dist"
  "copy-onsen-js-dist"
  "copy-js-dist"
  "copy-img-dist"
  "copy-fonts-dist"
]