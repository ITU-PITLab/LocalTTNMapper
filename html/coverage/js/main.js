var mymap = L.map('map', {
        center: [55.65997408676884,12.591246147457127],
        zoom: 18
});


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

var markers = new L.markerClusterGroup();
var points = []
