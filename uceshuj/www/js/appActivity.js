function menuClicked(){
	alert("You clicked the menu");
}

function replaceGraphs(){
	document.getElementById("graphdiv").innerHTML="<img src='images/ucl.png'>"
}

// load the map
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
// load the tiles
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
maxZoom: 18,
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,'+
'Imagery © <a href="http://mapbox.com">Mapbox</a>',
id: 'mapbox.streets'
}).addTo(mymap);

// create funtions for popup displaying clicked location	
var popup = L.popup();

// create an event detector to wait for the user's click event and then use the popup to show them where they clicked
// note that you don't need to do any complicated maths to convert screen coordinates to real world coordiantes - the Leaflet API does this for you

function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("<b>You clicked the map at </b><b align='center' style='margin-top:0.1em; margin-bottom:0em; font-size:100%;' onclick='onPopupContentClick()'>("+e.latlng.lng.toFixed(4).toString()+","+e.latlng.lat.toFixed(4).toString()+") </b>")
		.openOn(mymap);	
}
// now add the click event detector to the map
mymap.on('click', onMapClick);

// create a function for calculating distance 
function getDistance() {
		alert('getting distance');
		// getDistanceFromPoint is the function called once the distance has been found
		navigator.geolocation.getCurrentPosition(getDistanceFromPoint);
}

function getDistanceFromPoint(position) {
		// find the coordinates of a point using this website:
		// these are the coordinates for Warren Street
		var lat = 51.524616;
		var lng = -0.13818;
		// return the distance in kilometers
		var distance = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'K');
		document.getElementById('showDistanceUCL').innerHTML = "Distance: " + distance;
}

// code adapted from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-inyour-web-apps.html
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	subAngle = Math.acos(subAngle);
	subAngle = subAngle * 180/Math.PI; // convert the degree value returned by acos back to degrees from radians
	dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
	// where radius of the earth is 3956 miles
	if (unit=="K") { dist = dist * 1.609344 ;} // convert miles to km
	if (unit=="N") { dist = dist * 0.8684 ;} // convert miles to nautical miles
	return dist;
}


// create functions for tracking user's Location
function trackLocation() {
	if (navigator.geolocation) {
	confirm("show your current position")
	 var options = {watch:true,enableHighAccuracy:true,frequency:3000};
	navigator.geolocation.watchPosition(onSuccess,onError,options);
 } else {
	document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
 }
}

var currentlocationlayer;
function onSuccess(position) {
	if (mymap.hasLayer(currentlocationlayer)){
		alert("There is a marker");
		mymap.removeLayer(currentlocationlayer);
	}else{
		alert("There is no marker");
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
		}).addTo(mymap).bindPopup("<b>"+geojsonFeature.properties.name+"("+
		geojsonFeature.properties.popupContent+" )</b>");
		
	mymap.flyToBounds(currentlocationlayer.getBounds(),{maxZoom:15});
}

// onError Callback receives a PositionError object
function onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}

