#!/usr/bin/env python

import RPi.GPIO as GPIO
import time
import requests

def greeting():
  "Plays greeting audio via REST API"
  r = requests.get("http://localhost:3000/playAudio/welcome.mp3");

def decCount(i):
  if i > 0:
    i -= 1

T_POLL = 0.5  # sec
T_INSIDE_ACTIVE = 20  # sec
T_WELCOME_DELAY = 2  # sec
T_WELCOME_COOLDOWN = 60  # 1 min
T_DOOR_INACTIVE = 300  # 5 min

PIN_PIR = 15
PIN_DOOR = 14

GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN_PIR, GPIO.IN)
GPIO.setup(PIN_DOOR, GPIO.IN)
GPIO.setup(PIN_DOOR, GPIO.IN, pull_up_down=GPIO.PUD_UP)

isInBefore = False  # nobody
doorOpenBefore = False

countIn = 0
countDoor = 0

print "Starting"

while True:
  doorOpen = GPIO.input(PIN_DOOR)
  isIn = GPIO.input(PIN_PIR)

  print "[DEBUG] doorOpen: {}, isIn: {}, countIn: {}, countDoor {}".format(doorOpen, isIn, countIn, countDoor)

  if doorOpen and not doorOpenBefore:
    print "Somebody's opened the door"
    countDoor = T_INSIDE_ACTIVE / T_POLL

  if isIn and not isInBefore:
    if countDoor > 0 and countIn == 0:
      print "Hello!"
      time.sleep(T_WELCOME_DELAY)
      greeting()
      time.sleep(T_WELCOME_COOLDOWN)
      countOut = 0
      # countIn = 0 # probably redundant
    else:
      print "Somebody's leaving! No hello for {} min".format(T_DOOR_INACTIVE / 60)
      countIn = T_DOOR_INACTIVE / T_POLL

  time.sleep(T_POLL)

  isInBefore = isIn
  doorOpenBefore = doorOpen

  countDoor -= 1 if countDoor > 0 else 0
  countIn -= 1 if countIn > 0 else 0
 
