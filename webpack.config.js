 var path = require('path');
 var webpack = require('webpack');

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
                 query: {
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };

