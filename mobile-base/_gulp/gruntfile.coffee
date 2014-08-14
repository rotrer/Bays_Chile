# "use strict"

# module.exports = (grunt) ->
#   grunt.loadNpmTasks('grunt-webfont')
#   grunt.loadNpmTasks('grunt-favicons')

#   src  = "../assets"
#   dest = "../assets"

#   grunt.initConfig
#     webfont:
#       icons:
#         src: src + "/images/icons/svg/*.svg"
#         dest: dest + "/fonts/webfont"
#         options:
#           font: "webfont"
#           hashes: false
#           stylesheet: "scss"
#           destCss: src + "/styles/components"
#           relativeFontPath: "../fonts/webfont/"
#           # styles: false
#           templateOptions:
#             baseClass: 'fo'
#             classPrefix: 'fo-'
#             mixinPrefix: 'fo-'

#     favicons:
#       options:
#         trueColor: true
#         precomposed: false
#         appleTouchBackgroundColor: "#ffffff"
#         windowsTile: true
#         tileBlackWhite: false
#         tileColor: "auto"
#         html: ""
#         HTMLPrefix: ""

#       icons:
#         src: src + "/images/favicon.png"
#         dest: src + "/images/favicons"


#   grunt.registerTask "default", [
#   ]
