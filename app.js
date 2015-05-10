var express = require('express');
var multer = require('multer');
var fs = require('fs');
var proc = require('child_process');

var app = express();

// Primary page
app.get('/', function (req, res) {
	res.sendFile('view.html', {root: __dirname});
});

// Resources
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));

// Configure multer for file uploads
app.use(multer({ dest: './audio/',
	rename: function (fieldname, filename) {
		return filename;
	},
	onFileUploadStart: function (file) {
		console.log(file.originalname + ' is starting ...');
	},
	onFileUploadComplete: function (file) {
		console.log(file.fieldname + ' uploaded to  ' + file.path);
	}
}));

// API

// getAudioList: get list of audio files in 'audio' directory
app.get('/getAudioList', function (req, res) {
	fs.readdir('audio', function(err, files){
		if(err) {
			console.log(err);
			return;
		}
		console.log(files);
		res.send(files);
	});
});

// playAudio/filename: play filename
app.get('/playAudio/:file', function (req, res) {
	var file = req.params.file;
	var cmd = '';
	
	if(file.match(/.wav/))	
		cmd = 'aplay';
	else if(file.match(/.mp3/))
		cmd = 'mpg123';
	else {
		res.send("Unsupported audio format");
		return;
	}

	proc.exec(cmd+' audio/'+file, function (error, stdout, stderr) {
		if(error) {
			console.log(stderr);
			res.send(error);
			return;
		}
		res.send('Played '+file);
	});
});

app.post('/uploadAudio', function (req, res) {
	console.log(req.files);
	res.redirect("/");
});

app.post('/sayText/:text', function (req, res) {
	var text = req.params.text;
	console.log(text);
	proc.exec('./horsesay '+text, function (error, stdout, stderr) {
		if(error) {
			console.log(stderr);
			res.send(error);
			return;
		}
		res.send('Horse said "'+text+'"');
	});
});


// Run server
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Horse app listening at http://%s:%s', host, port);

});