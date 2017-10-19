var path = require('path');
var webpack = require('webpack');

let debug =  process.env['NODE_ENV'] != "production"

module.exports = {
	entry:  './src/browser/rendering.js',
	output: {
		path: path.resolve(__dirname, 'htdocs'),
		filename: 'application.js',
		library: 'nn'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: { }
			}
		]
	},
	stats: {
		colors: true
	},
	devtool: 'source-map',
	plugins: debug ? [] :  [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
	],
};

