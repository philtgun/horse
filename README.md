# Horse 

RaspberryPi-powered multi-purpose horse

* Can play audio on demand 
* Can upload more sounds (currently only mp3 and wav supplorted)
* Plays welcome sound when someone comes in
* Turns sound down for the night (0:00 ~ 10:00)

Hardware used:
* RaspberryPi B+
* USB-powered speakers
* 2 PIR motion sensors
* Long 4-line wire
* Horse mask, scarf, cowboy hat

With slight modifications should work on any linux system, not tested on anything except Debian

## Requirements

```
sudo apt-get install mpg123
```

## Running the horse

### Web interface:
Requires node.js and
* express
* multer

Dependencies:
`npm install`

Run:
`node horse-web.js`

### Horse welcome:
Requires python 2.7.3+
* RPi.GPIO
* requests

Dependencies:
`sudo pip install -r requirements.txt`

Run:
`python horse-welcome.py`

### Install as services

* **init.d**:
```
# Put horseweb and horsewelcome files into /etc/init.d system folder
cp etc/init.d/* /etc/init.d/			
# create runlevel symlinks:
sudo update-rc.d servicename defaults 
```

* **systemd**:
```
cp etc/systemd/system/* /etc/systemd/system/
sudo systemctl daemon-reload
```

### Config file

`horse-web` reads config files from `./config` directory (see [node-config](https://github.com/lorenwest/node-config) for reference)

Available config options:
```
{
	"sleepy_time": [0, 9]	// defines sleepy time span in hours (e.g. from 0:00 until 9:00)
}
```

### ~~(deprecated) Sleepy horse~~

Puts your horse to sleep for nighttime so it will not make any sounds.

Put sleepyhorse.cron into /etc/cron.d and restart crond

## Source code used (credits to these guys):
* [grevory/bootstrap-file-input](https://github.com/grevory/bootstrap-file-input)
* [Speech Script by Dan Fountain](http://danfountain.com/2013/03/raspberry-pi-text-to-speech/)
* [chovy/node-startup](https://github.com/chovy/node-startup)
