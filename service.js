var express = require("express");
var port = 9995;

var app = express();
app.use( express.static( __dirname + "/htdocs" ) );
app.listen( port, function(){
	console.log("Lisening", port);
});
