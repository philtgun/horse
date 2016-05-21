var express = require('express');
var bodyParser = require('body-parser')
var multer = require('multer');
var fs = require('fs');
var proc = require('child_process');

var app = express();
app.use(bodyParser.json());

// Primary page
app.get('/', function (req, res) {
	res.sendFile('view.html', {root: __dirname});
});

// Resources
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/icons", express.static(__dirname + '/icons'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './audio')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

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

app.get('/stopAudio', function (req, res) {
	var processes = {
		'aplay': false,
		'mpg123': false
	}
	var sendResponse = function (name) {
		processes[name] = true
		for(var item in processes) {
			if(!processes[item])
				return
		} 
		res.send('Stopped audio')
	}
	Object.keys(processes).forEach(function (item){
		proc.exec('killall ' + item, function (error, stdout, stderr) {
			console.log('Killed ' + item);
			sendResponse(item);
		});
	});
});

app.post('/uploadAudio', upload.single('audioFile'), function (req, res) {
	console.log(req.files);
	res.redirect("/");
});

app.post('/sayText', function (req, res) {
	console.log(req.body);
	var text = req.body['text'];
	proc.exec('./horse-say "'+text+'"', function (error, stdout, stderr) {
		if(error) {
			console.log(stderr);
			res.send(error);
			return;
		}
		res.send('Horse said "'+text+'"');
	});
});

app.get('/tempMute', function (req, res) {
	var date = new Date();
	if(date.getHours() >= 0 && date.getHours() <= 10) {
		res.send('Horse is already sleeping')
		return
	}
	console.log('Muting')
	var setVolume = function (level) {
		proc.exec("amixer sset 'PCM' "+level+"%", function (error, stdout, stderr) {
			console.log(stderr)
		});
	}
	setVolume(0);
	setTimeout(function () {
		console.log('Unmuting')
		setVolume(95);
	}, 30000);
	res.send('Muted for 30 secs')
})

// Run server
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Horse app listening at http://%s:%s', host, port);

});