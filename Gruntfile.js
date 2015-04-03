module.exports = function( grunt ){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			app : {
				src: ["src/browser/*.js"],
				dest: "htdocs/application.js"
			},
			libs: {
				src: ["bower_components/threejs/build/three.js", "bower_components/stats.js/build/stats.min.js" ],
				dest: "htdocs/libs.js"
			}
		},
		watch : {
			app_js: {
				files: ["src/browser/*.js"],
				tasks: ["concat:app"]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
}
