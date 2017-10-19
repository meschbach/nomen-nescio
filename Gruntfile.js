module.exports = function( grunt ){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			designer: {
				src: ["src/ship-designer/**/*.js"],
				dest: "htdocs/designer/ship-designer.js"
			},
			app_css: {
				src: ["src/browser/*.css"],
				dest: "htdocs/application.css"
			},
		},
		watch : {
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
