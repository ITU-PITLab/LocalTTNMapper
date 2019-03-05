// Add the gateway markercluster layer
mymap.addLayer(markers)

// Function to generate styling based on gateway RSSI
function getGtwStyle(gtw) {
  s = new Object()
  if(gtw.rssi < -110) {
		s.color = "red"
		s.radius = 20
		s.opacity = 0.2
	}
	else if(gtw.rssi < -90) {
		s.color = "yellow"
		s.radius = 15
		s.opacity = 0.35
	}
	else {
		s.color = "green"
		s.radius = 10
		s.opacity = 0.5
	}
  return s
}


circles = []
lines = []

// Iterate over all points saved in nodes.js and generate circles and lines
for (let p of points) {
	lat = p.payload_fields.latitude
	lon = p.payload_fields.longitude

  gtws = p.metadata.gateways
  mainStyle = getGtwStyle(gtws[0])

  //Generate html information about the gateways for this point
	gtwString = ""
	gtws.forEach((gtw, i) => {
		//calculate distance
		distance = HaversineKm(lat,lon,gtw.latitude, gtw.longitude)
		//write info string
		gtwString += '<br><b>Gateway '+(i+1)+'</b>: ' + gtw['gtw_id'] + '<br>Distance: ' + distance +
		' km<br>RSSI: ' + gtw['rssi'] + '<br>SNR: ' + gtw['snr']
	})
	
  //Generate circle and add popup
	circles.push(L.circle([lat, lon],
		{stroke: false, fill: true ,fillColor: mainStyle.color, fillOpacity: mainStyle.opacity, radius: mainStyle.radius})
		.bindPopup("Device: <b>"+p.dev_id+"</b>"+
		'<br>Freq: ' + p["metadata"]["frequency"] +
		'<br>DR: ' + p['metadata']['data_rate'] +
		gtwString))

  //Generate connection lines to gateways
	gtws.forEach((gtw) => {
    s = getGtwStyle(gtw)
		lines.push(L.polyline([[lat, lon],[gtw.latitude, gtw.longitude]], {color: s.color, weight: 1, opacity: s.opacity}))
	})
}

//Add the lines and circles to seperate feature groups, and only add the circles to the map.
circleGroup = L.featureGroup(circles)
lineGroup = L.featureGroup(lines)
circleGroup.addTo(mymap)
linesVisible = false

//Function triggered by button on page. Shows/hides gateway connection lines and disables/enables clustering.
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

function HaversineKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d.toFixed(2);
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
