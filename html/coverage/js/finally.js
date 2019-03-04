mymap.addLayer(markers)

circles = []
lines = []

for (let p of points) {
	lat = p.payload_fields.latitude
	lon = p.payload_fields.longitude

	rssi = p.metadata.gateways[0].rssi
	if(rssi < -110) {
		color = "red"
		radius = 15
		opacity = 0.2
	}
	else if(rssi < -90) {
		color = "yellow"
		radius = 10
		opacity = 0.35
	}
	else {
		color = "green"
		radius = 6
		opacity = 0.5
	}
	
	gtws = p.metadata.gateways
	gtwString = ""
	gtws.forEach((gtw, i) => {
		gtwString += '<br><b>Gateway '+(i+1)+'</b>: ' + gtw['gtw_id'] +
		'<br>RSSI: ' + gtw['rssi'] + '<br>SNR: ' + gtw['snr']
	})

	L.circle([lat, lon], 
		{stroke: false, fill: true ,fillColor: color, fillOpacity: opacity, radius: radius})	
		.addTo(mymap).bindPopup("Device: <b>"+p.dev_id+"</b>"+
		'<br>Freq: ' + p["metadata"]["frequency"] +
		'<br>DR: ' + p['metadata']['data_rate'] +
		gtwString)
	
	gtws.forEach((gtw) => {
		L.polyline([[lat, lon],[gtw.latitude, gtw.longitude]], {color: "blue", weight: 1, opacity: 0.2}).addTo(mymap)
	})
}

