
// load the map for tracking user's location and showing its position on map
var mymap2 = L.map('mapid2').setView([51.505, -0.09], 13);

// load the tiles
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
maxZoom: 18,
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,'+
'Imagery © <a href="http://mapbox.com">Mapbox</a>',
id: 'mapbox.streets'
}).addTo(mymap2);


// create functions for tracking user's Location
function trackLocation() {
	if (navigator.geolocation) {
	confirm("show your current position")
	navigator.geolocation.watchPosition(showPosition);
 } else {
	document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
 }
}

var currentlocationlayer;
function showPosition(position) {
	if (mymap2.hasLayer(currentlocationlayer)){
		alert ("already added marker")
		mymap2.removeLayer(currentlocationlayer);
	}
	
	// create a geoJSON feature -
	var geojsonFeature = {
		"type": "Feature",
		"properties": {
		"name": "Your Location",
		"popupContent": [position.coords.longitude.toFixed(4), position.coords.latitude.toFixed(4)]
		},
		"geometry": {
		"type": "Point",
		"coordinates": [position.coords.longitude, position.coords.latitude]
		}
	};	
	
	// create Maker icon 
	var testMarkerPink = L.AwesomeMarkers.icon({
		icon: 'play',
		markerColor: 'pink'
	});	
	
	currentlocationlayer = L.geoJSON(geojsonFeature, {
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {icon:testMarkerPink});
			}
		}).addTo(mymap2).bindPopup("<b>"+geojsonFeature.properties.name+"("+
		geojsonFeature.properties.popupContent+" )</b>");
		
	mymap2.flyToBounds(currentlocationlayer.getBounds(),{maxZoom:13});
}
