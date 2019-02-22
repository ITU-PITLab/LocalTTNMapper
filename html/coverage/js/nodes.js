var circle = L.circle([55.659075,12.593815], {
color: 'green',fillColor: 'green',fillOpacity: 0.5,
radius: 10 
}).addTo(mymap).bindPopup("Device: <b> pitlab-ttn-mapper-2 </b><br>Freq: 867.3<br>DR: SF7BW125<br><b>Gateway 1</b>: eui-0000024b0805024b<br>RSSI: -84<br>SNR: 9.5<br><b>Gateway 2</b>: eui-0000024b0803147b<br>RSSI: -31<br>SNR: 9.8<br><b>Gateway 3</b>: pitlab3-multitech<br>RSSI: -29<br>SNR: 10");
