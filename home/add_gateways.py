#!/usr/bin/python
# ----------------------------------------------------------------
# File: add_gateways.py
#
# This script downloads the list of TTN gateways around a certain central point.

import os

filePath = '/var/www/html/coverage/js/gateways.js';
 
# As file at filePath is deleted now, so we should check if file exists or not not before deleting them
if os.path.exists(filePath):
    os.remove(filePath)

import urllib, json
url = "https://www.thethingsnetwork.org/gateway-data/location?latitude=55.6599740&longitude=12.5912461&distance=2000000"
response = urllib.urlopen(url)
data = json.loads(response.read())
#print data
print("The following Gateways are added to the coverage map:")

for key in data:
    if 'description' in data[key].keys(): gateway_name=data[key]['description']
    else: gateway_name = "unknown"
    gtw_id=data[key]['id']
    print(gtw_id)    
    print(gateway_name)
    lat = data[key]['location']['latitude']  
    lon = data[key]['location']['longitude']
    alt = data[key]['location']['altitude'] 
    file = open("/var/www/html/coverage/js/gateways.js","a")
    file.write('markers.addLayer(L.marker([')
    file.write("%f," % lat)
    file.write("%f," % lon)
    file.write("]));")
    file.close()



