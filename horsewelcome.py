import RPi.GPIO as GPIO
import time
import requests

def greeting():
  "Plays greeting audio via REST API"
  r = requests.get("http://127.0.0.1:3000/playAudio/welcome.mp3");

def decCount(i):
  if i > 0:
    i -= 1

# pin IDs
PIN_CARPET = 18
PIN_DOOR   = 15

# timers in seconds
T_POLL = 0.2 
T_CARPETACTIVE = 20 
T_WELCOMECOOLDOWN = 60
T_DOORINACTIVE = 5*60

# GPIO setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN_CARPET, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(PIN_DOOR, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# init states and timers
prevBtnState = True # not pressed
prevDoorState = False # closed
btnCount = 0
doorCount = 0

while True:
  doorState = GPIO.input(PIN_DOOR)
  btnState = GPIO.input(PIN_CARPET)

  if doorState == True and prevDoorState == False and btnCount == 0:
    print "Somebody's arrived"
    doorCount = T_CARPETACTIVE / T_POLL

  if btnState == False and prevBtnState == True:
    if doorCount > 0:
      print "Hello!"
      greeting()
      time.sleep(T_WELCOMECOOLDOWN)
      doorCount = 0
      btnCount = 0 # probably redundant
    
    else:
      print "Somebody's leaving! No hello for 5 min"
      btnCount = T_DOORINACTIVE / T_POLL

  time.sleep(T_POLL)

  prevBtnState = btnState
  prevDoorState = doorState

  decCount(doorCount)
  decCount(btnCount)
