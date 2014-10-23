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
  .pipe gulp.dest dest + dirAssets + "scripts/onsen/css"
gulp.task "copy-onsen-js", ->
  gulp.src [
    "bower_components/onsenui/build/js/onsenui_all.js"
  ]
  .pipe uglify()
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
    "bower_components/angulartics/dist/angulartics.min.js"
    "bower_components/angulartics/dist/angulartics-ga.min.js"
  ]
  .pipe gulp.dest dest + dirAssets + "scripts"
#copy js scripts app
gulp.task "copy-js", ->
  gulp.src [
    src + "/scripts/*.js"
  ]
  .pipe uglify
    mangle: false
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
# .pipe minifycss


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
  "copy-libs"
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
