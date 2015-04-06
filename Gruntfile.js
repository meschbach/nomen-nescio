module.exports = function( grunt ){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			app : {
				src: ["src/browser/*.js"],
				dest: "htdocs/application.js"
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
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
}
