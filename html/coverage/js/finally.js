// Add the gateway markercluster layer
mymap.addLayer(markers)

// Function to generate styling based on gateway RSSI
function getGtwStyle(gtw) {
  s = new Object()
	  if(gtw.rssi < -80) {
		s.color = "#ff0000"
		s.radius = 2
		s.opacity = 0.2
	}
	else if(gtw.rssi < -60) {
		s.color = "#993300"
		s.radius = 4
		s.opacity = 0.3
	}
	else if(gtw.rssi < -40) {
		s.color = "#ffff00"
		s.radius = 6
		s.opacity = 0.4
	}
	else if(gtw.rssi < -30) {
		s.color = "#339900"
		s.radius = 8
		s.opacity = 0.5
	}
	else {
		s.color = "#00ff00"
		s.radius = 10
		s.opacity = 0.8
	}
  return s
}

circles = []
lines = []

// Iterate over all points saved in nodes.js and generate circles and lines
for (let p of points) {

if (p.payload_fields){ //only generate if there is valid payload


	lat = 1.0 * p.payload_fields.latitude.toFixed(6)
	lon = 1.0 * p.payload_fields.longitude.toFixed(6)
        rssimin = 0
  gtws = p.metadata.gateways
  var distance = [];
  var gtwssorted = [];

  //Calculate things
	gtws.forEach((gtw, i) => {
		//Check if weakest RSSI

		if (gtw['rssi'] < rssimin){
			rssimin = gtw['rssi'];
			gtwssorted.push(gtws[i]);
		}

	})

  // Generate html information about the gateways for this point

        gtwString = "";
	  mainStyle = getGtwStyle(gtwssorted[0])

        gtwssorted.forEach((gtw, i) => {
             s = getGtwStyle(gtw)
                //calculate distance
                distance[i] = HaversineKm(lat,lon,gtw.latitude, gtw.longitude)

                gtwString += '<br>'
                gtwString += '<b>Gateway '+(i+1)+'</b>: ' + gtw['gtw_id'] + '<br>Distance: ' + distance[i] +
                ' km<br>'
		gtwString += 'RSSI: ' + gtw['rssi'] + '<br>SNR: ' + gtw['snr']
        })

  //Generate circle and add popup
	circles.push(L.circle([lat, lon],
		{stroke: false, fill: true ,fillColor: mainStyle.color, fillOpacity: mainStyle.opacity, radius: mainStyle.radius})
		.bindPopup("Device: <b>"+p.dev_id+"</b>"+
		'<br>Freq: ' + p["metadata"]["frequency"] +
		'<br>DR: ' + p['metadata']['data_rate'] +
		gtwString))

  //Generate connection lines to gateways
	gtwssorted.forEach((gtw) => {
    thisStyle = getGtwStyle(gtw)
		if((typeof gtw.latitude == 'number') && (typeof gtw.longitude == 'number')){
		      lines.push(L.polyline([[lat, lon],[gtw.latitude, gtw.longitude]], {color: thisStyle.color, weight: 1, opacity: thisStyle.opacity}))
		}
	})
} // End of IF clause for valid payload
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

