var record = require('node-record-lpcm16');
var snowboy = require('snowboy');
var proc = require('child_process');

var models = new snowboy.Models();

models.add({
  file: 'resources/alexa.umdl',
  sensitivity: '0.5',
  hotwords : 'alexa'
});

models.add({
  file: 'resources/yeah.pmdl',
  sensitivity: '0.5',
  hotwords: 'yeah'
})

models.add({
  file: 'resources/da_kon.pmdl',
  sensitivity: '0.5',
  hotwords: 'da_kon'
})

var detector = new snowboy.Detector({
  resource: "resources/common.res",
  models: models,
  audioGain: 1.0
});

detector.on('silence', function () {
  //console.log('silence');
});

detector.on('sound', function () {
  //console.log('sound');
});

detector.on('error', function () {
  console.log('error');
});

detector.on('hotword', function (index, hotword) {
  console.log('hotword', index, hotword);
  proc.exec('aplay ~/horse/audio/yeah.wav')
});

var mic = record.start({
  threshold: 0.5,
  verbose: false
});

mic.pipe(detector);

console.log("Started hotword detection...")