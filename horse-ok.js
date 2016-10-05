var record = require('node-record-lpcm16');
var snowboy = require('snowboy');
var proc = require('child_process');
var moment = require('moment');
var config = require('config');


var SLEEPY_TIME = null
var HOTWORDS = null
var HOTWORDS_AUDIO_GAIN = 1.0
var HOTWORDS_SILENCE_THRESHOLD = 0.5

var cooldowns = {}

// Functions
function getConfigProp(prop, def){
   if(!config.has(prop)){
      return def
   }
   return config.get(prop)
}

function readConfig(){
   SLEEPY_TIME = getConfigProp('sleepy_time', [0, 9]);
   HOTWORDS = getConfigProp('hotwords', {
      "*": {
         "actions": [{
            "action": "playAudioFile",
            "payload": "audio/yeah.wav",
            "cooldown": 3000
         }]
      }
   });
   HOTWORDS_AUDIO_GAIN = getConfigProp('hotwords_audio_gain', HOTWORDS_AUDIO_GAIN);
   HOTWORDS_SILENCE_THRESHOLD = getConfigProp('hotwords_silence_threshold', HOTWORDS_SILENCE_THRESHOLD);
}

function isSleepyTime(){
   hours = moment().hours()
   return hours >= SLEEPY_TIME[0] && hours < SLEEPY_TIME[1]
}

function playAudioFile(file, cb){
   if(isSleepyTime()){
      cb("sleepy time")
      return;
   }

   var cmd = '';
   if(file.match(/.wav/)){
      cmd = 'aplay';
   } else if(file.match(/.mp3/)) {
      cmd = 'mpg123';
   } else {
      cb("Unsupported audio format");
      return;  
   }

   proc.exec(cmd+' '+file, cb);
}

function matchTriggerToAction(trigger){
   actions = null
   try{
      actions = HOTWORDS[trigger]["actions"]
   } catch(e){
      actions = HOTWORDS["*"]["actions"]
      trigger = "*"
   }
   
   for(var i=0; i<actions.length; i++){
      processAction(actions[i]);
   }
}

function processAction(hotword, action_idx, action){
   // check cooldown sanity
   cd = action["cooldown"]
   if(cd == null || !Number.isInteger(cd) || cd<0){
      cd = null     
   }

   // check if still in cooldown
   if (cd !== null){
      try{     
         if(new Date() - cooldowns[hotword][action_idx] <= cd){
            console.log("action is still in cooldown")
            return;
         }
      } catch(e){}
   }
   
   // if not in cooldown   
   doAction(action)

   // set cooldown (if needed)
   if (cd !== null){
      if(cooldowns[hotword] == null) cooldowns[hotword] = {}
      cooldowns[hotword][action_idx] = new Date()
   }
}

function doAction(action){
   switch(action["action"]){
      case "playAudioFile":
         playAudioFile(action["payload"], function(err){
            if(err){
               console.log(err)
            }
         });
         break;
      default:
         break;
   }
}

function loadModels(models){
   for(var hotword in HOTWORDS){
      if(!HOTWORDS.hasOwnProperty(hotword)){
         continue
      }

      m = HOTWORDS[hotword]['model']
      if(m != null){
         models.add(m)
      }
   }
}

// Start detector
readConfig();

var models = new snowboy.Models();

loadModels(models);

var detector = new snowboy.Detector({
   resource: "resources/common.res",
   models: models,
   audioGain: HOTWORDS_AUDIO_GAIN
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
   matchTriggerToAction(hotword)
});

var mic = record.start({
   threshold: HOTWORDS_SILENCE_THRESHOLD,
   verbose: false
});

mic.pipe(detector);

console.log("Started hotword detection...")