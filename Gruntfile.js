module.exports = function( grunt ){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			app : {
				src: ["src/browser/*.js"],
				dest: "htdocs/application.js"
			},
			designer: {
				src: ["src/ship-designer/**/*.js"],
				dest: "htdocs/designer/ship-designer.js"
			},
			app_css: {
				src: ["src/browser/*.css"],
				dest: "htdocs/application.css"
			},
			libs: {
				src: [
					"bower_components/threejs/build/three.js",
					"bower_components/threejs/examples/js/loaders/ColladaLoader.js",
					"bower_components/stats.js/build/stats.min.js"
				],
				dest: "htdocs/libs.js"
			}
		},
		watch : {
			app_js: {
				files: ["src/browser/*.js"],
				tasks: ["concat:app"]
			},
			app_css: {
				files: ["src/browser/*.css"],
				tasks: "concat:app_css"
			},
			ship_designer_js: {
				files: ["src/ship-designer/**/*.js"],
				tasks: ["concat:designer"]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
}
