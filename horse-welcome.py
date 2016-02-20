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
T_OUTSIDE_INACTIVE = 300  # 5 min

GPIO.setmode(GPIO.BCM)
GPIO.setup(14, GPIO.IN)
GPIO.setup(15, GPIO.IN)

isInBefore = False  # nobody
isOutBefore = False  # nobody

countIn = 0
countOut = 0

print "Starting"

while True:
  isOut = GPIO.input(15)
  isIn = GPIO.input(14)

  # print "[DEBUG] outside: {}, inside: {}".format(isOut, isIn)

  if isOut and countOut == 0:
    print "Somebody's arriving"
    countOut = T_INSIDE_ACTIVE / T_POLL

  if isIn and not isInBefore:
    if countOut > 0:
      print "Hello!"
      time.sleep(T_WELCOME_DELAY)
      greeting()
      time.sleep(T_WELCOME_COOLDOWN)
      countOut = 0
      countIn = 0 # probably redundant
    else:
      print "Somebody's leaving! No hello for {} min".format(T_OUTSIDE_INACTIVE / 60)
      countIn = T_OUTSIDE_INACTIVE / T_POLL

  time.sleep(T_POLL)

  isInBefore = isIn
  isOutBefore = isOut

  decCount(countOut)
  decCount(countIn)
 
