/**
 * NOTE
 *
 * This is a single page app server.js is only used to serve static files.
 * All other files are related to the client side.
 */

"use strict";

var express = require("express"),
	app = express();

app.use(express.static('.'));

app.get('/*', function (req, res) {
	res.sendFile("index.html", { root: "./" });
});

app.listen(8080);
console.log("Listening on port 8080...")