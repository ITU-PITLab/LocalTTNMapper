mymap.addLayer(markers)

circles = []
lines = []

for (let p of points) {
	lat = p.payload_fields.latitude
	lon = p.payload_fields.longitude

	rssi = p.metadata.gateways[0].rssi
	if(rssi < -110) {
		color = "red"
		radius = 20
		opacity = 0.2
	}
	else if(rssi < -90) {
		color = "yellow"
		radius = 15
		opacity = 0.35
	}
	else {
		color = "green"
		radius = 10
		opacity = 0.5
	}

	gtws = p.metadata.gateways
	gtwString = ""
	gtws.forEach((gtw, i) => {
		gtwString += '<br><b>Gateway '+(i+1)+'</b>: ' + gtw['gtw_id'] +
		'<br>RSSI: ' + gtw['rssi'] + '<br>SNR: ' + gtw['snr']
	})

	circles.push(L.circle([lat, lon],
		{stroke: false, fill: true ,fillColor: color, fillOpacity: opacity, radius: radius})
		.bindPopup("Device: <b>"+p.dev_id+"</b>"+
		'<br>Freq: ' + p["metadata"]["frequency"] +
		'<br>DR: ' + p['metadata']['data_rate'] +
		gtwString))

	gtws.forEach((gtw) => {
		lines.push(L.polyline([[lat, lon],[gtw.latitude, gtw.longitude]], {color: "blue", weight: 1, opacity: 0.2}))
	})
}

//Add the lines and circles
circleGroup = L.featureGroup(circles)
lineGroup = L.featureGroup(lines)
circleGroup.addTo(mymap)
linesVisible = false

function toggleLines() {
  if(linesVisible) {
    mymap.removeLayer(lineGroup)
    markers.enableClustering()
    document.getElementById("line-toggle").innerHTML = "<span>Show gateway connections</span>"
    linesVisible = false
  }
  else {
    mymap.addLayer(lineGroup)
    markers.disableClustering()
    document.getElementById("line-toggle").innerHTML = "<span>Hide gateway connections</span>"
    linesVisible = true
  }
}
