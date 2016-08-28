import json
import urllib2

def handler(event, context):
    if event['object'] == 'page':
        for entry in event['entry']:
            for msg_event in entry['messaging']:
                if 'message' in msg_event:
                    msg = msg_event['message']
                    text = msg['text']
                    print "Received message: {}".format(text)
                    if text == 'yeah':
                        playYeah()
    return {}


def playYeah():
    return urllib2.urlopen("http://room318.ddns.net/playAudio/yeah.wav").read()

