$(document).ready(() => {
    const $newp3pform = $('#newp3pform');
    const $currp3pfile = $('#currentlySelected');
    $newp3pform.on('submit', (e) => {
        $newp3pfile = $('#newp3pfile');
        $currp3pfile.text($newp3pfile.val());
    });

    // Add form functionality below
	//Modifications: https://www.tutorialspoint.com/expressjs/expressjs_form_data.htm

	var express = require('express');
	var bodyParser = require('body-parser');
	var multer = require('multer');
	var upload = multer();
	var app = express();

	app.get('/', function(req, res){
	   res.render('form');
	});

	app.set('view engine', 'pug');
	app.set('views', './views');

	// for parsing application/json
	app.use(bodyParser.json()); 

	// for parsing application/xwww-
	app.use(bodyParser.urlencoded({ extended: true })); 
	//form-urlencoded

	// for parsing multipart/form-data
	app.use(upload.array()); 
	app.use(express.static('public'));

	app.post('/', function(req, res){
	   console.log(req.body);
	   res.send("recieved your request!");
	});
	app.listen(3000);


});