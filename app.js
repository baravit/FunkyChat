const express   = require('express');
const app       = express();
const bodyParser 	= require('body-parser');
const multer = require('multer');
const upload = multer();
const port      = 3000;

//For extract the entire body portion of an incoming request 
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/client`)); 		// statics
require(`./server/routes.js`)(app);						// routes

app.listen(port);										// let the games begin!
console.log(`Web server listening on port ${port}`);
