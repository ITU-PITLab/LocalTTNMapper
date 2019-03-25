#!/usr/bin/python
# ----------------------------------------------------------------
# File: coverage.py 
#
# This file executes an MQTT subscriber to TTN and then adds the poins to the coverage map. 

import json
import sys
import time
import base64
from datetime import datetime

import paho.mqtt.client as mqtt

THE_BROKER = "eu.thethings.network"
THE_TOPIC = "+/devices/+/up"

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected to ", client._host, "port: ", client._port)
    print("Flags: ", flags, "return code: ", rc)

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe(THE_TOPIC)

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    themsg = json.loads(str(msg.payload))

    payload_raw = themsg["payload_raw"]
    payload_plain = base64.b64decode(payload_raw)
    device = themsg["dev_id"]
    print(datetime.now())
    print(device + " with " + str(len(themsg['metadata']['gateways'])) + " gateways") 
    print("")
    
    file = open("/var/www/html/coverage/js/nodes.js","a")
    file.write('points.push('+str(msg.payload)+");\n")
    file.close()
        

client = mqtt.Client()
client.username_pw_set("pitlab-ttn-mapper", password="ttn-account-v2.YSTvD8CNEciE-ncAQrUEfbOtniNT4meQWJTdMuS8vIU")

client.on_connect = on_connect
client.on_message = on_message

client.connect(THE_BROKER, 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()
