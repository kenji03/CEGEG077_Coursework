function menuClicked(){
	alert("You clicked the menu");
}

function replaceGraphs(){
	document.getElementById("graphdiv").innerHTML="<img src='images/ucl.png'>"
}

// load the map
var mymap1 = L.map('mapid1').setView([51.505, -0.09], 13);

// load the tiles
function Loadtile(){
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
	'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,'+
	'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
	}).addTo(mymap1);
}

Loadtile();


// create funtions for popup displaying clicked location	
var popup = L.popup();
var click_longitude;
var click_latitude;
// create an event detector to wait for the user's click event and then use the popup to show them where they clicked
// note that you don't need to do any complicated maths to convert screen coordinates to real world coordiantes - the Leaflet API does this for you
function onPopupContentClick(){	
	document.getElementById("longitude").value = click_longitude;
	document.getElementById("latitude").value = click_latitude;
}

// note that you don't need to do any complicated maths to convert screen coordinates to real world coordiantes - the Leaflet API does this for you
function onGeoJSONPopupContentClick(){	
	document.getElementById("longitude").value = current_longitude;
	document.getElementById("latitude").value = current_latitude;
}

function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("<b>You clicked the map at </b><b align='center' style='margin-top:0.1em; margin-bottom:0em; font-size:100%;' onclick='onPopupContentClick()'>("+e.latlng.lng.toFixed(4).toString()+","+e.latlng.lat.toFixed(4).toString()+") </b>")
		.openOn(mymap1);	
		
	click_longitude = e.latlng.lng
	click_latitude = e.latlng.lat
}
// now add the click event detector to the map
mymap1.on('click', onMapClick);

// create a function for getting current position
var currentlocationlayer;

function getLocation(){
		alert('Getting Current Location');
		navigator.geolocation.getCurrentPosition(getPosition);
}

var current_longitude;
var current_latitude;
	
function getPosition(position){
	if (mymap1.hasLayer(currentlocationlayer)){
		mymap1.removeLayer(currentlocationlayer);
	}
	
	current_longitude = position.coords.longitude
	current_latitude = position.coords.latitude
	
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
				return L.marker(latlng);
			}
		}).addTo(mymap1).bindPopup("<b onclick='onGeoJSONPopupContentClick()'>"+geojsonFeature.properties.name+" ("+
		geojsonFeature.properties.popupContent+" )</b>");
     mymap1.flyToBounds(currentlocationlayer.getBounds(),{maxZoom:15});
}


document.addEventListener("DOMContentLoaded",function(event){
	var _selector = document.querySelector('input[name="onoffswitch"]');

	_selector.addEventListener('change',function(event){
		if (_selector.checked){
			alert("Back to Default")
			mymap1.setView([51.505, -0.09], 13)
		}else{
			window.getLocation();
		}
	});
});

function move() {
    var elem = document.getElementById("myBar"); 
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++; 
            elem.style.width = width + '%'; 
        }
    }
}
