# Horse 

RaspberryPi-powered multi-purpose horse

* Can play audio on demand 
* Can upload more sounds (currently only mp3 and wav supplorted)
* Plays welcome sound when someone comes in
* Turns sound down for the night (0:00 ~ 10:00)

# Running the horse

## Web interface:
Requires node.js and
* express
* multer

### Run:
`node app.js`

## Horse welcome:
Requires python 2.7.3+
* RPi.GPIO
* requests

### Run:
`python horse-welcome.py`

## Sleepy horse
Put sleepyhorse.cron into /etc/cron.d

# Source code used:
* [grevory/bootstrap-file-input](https://github.com/grevory/bootstrap-file-input)
* [Speech Script by Dan Fountain](http://danfountain.com/2013/03/raspberry-pi-text-to-speech/)