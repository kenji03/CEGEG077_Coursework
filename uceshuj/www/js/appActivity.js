function menuClicked(){
	alert("You clicked the menu");
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
     mymap1.flyToBounds(currentlocationlayer.getBounds(),{maxZoom:16});
}


document.addEventListener("DOMContentLoaded",function(event){
	var _selector = document.querySelector('input[name="onoffswitch"]');

	_selector.addEventListener('change',function(event){
		if (_selector.checked){
			alert("Back to Default")
			mymap1.setView([51.505, -0.09], 12)
		}else{
			window.getLocation();
		}
	});
});


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
	confirm("Track Location")
	var options = {watch:true,enableHighAccuracy:true,frequency:500};
	navigator.geolocation.watchPosition(onSuccess,onError,options);
 } else {
	document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
 }
}

var currentlocationlayer;

function onSuccess(position) {
	if (mymap2.hasLayer(currentlocationlayer)){
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
		
	mymap2.flyToBounds(currentlocationlayer.getBounds(),{maxZoom:15});
}

// onError Callback receives a PositionError object
function onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}


// add function to test that everything is working and upload it to the js sub directory
// create a function to get the first bit of text data from the from
function startDataUpload(){
	confirm("start data upload");
	
	var locationname = document.getElementById("location_name").value;
	var firstname = document.getElementById("firstname").value;
	var lastname = document.getElementById("lastname").value;
	var module = document.getElementById("moduleselectbox").value;
	var postString = "locationname="+locationname+"&firstname="+firstname +"&lastname=" +lastname +"&module=" +module;
	
	var question = document.getElementById("question").value;
	
	var choiceString = "";
	for (var i = 1;i<5;i++){
		if (i ==4){
			choiceString = choiceString+"choice"+i+"="+document.getElementById("choice"+i).value;
		}else{
			choiceString = choiceString+"choice"+i+"="+document.getElementById("choice"+i).value+"&";
		}
	}
	postString = postString+"&question="+question+"&"+choiceString;
	
	var answer = document.querySelector('input[name="answer"]:checked').value;
	var latitude = document.getElementById("latitude").value;
	var longitude = document.getElementById("longitude").value;
	
	postString = postString + "&answer="+ answer + "&latitude=" + latitude + "&longitude=" + longitude;
	processData(postString)
}

// add AJAX call and response method to code
var client;

function processData(postString){
	client = new XMLHttpRequest();
	client.open('POST', 'http://developer.cege.ucl.ac.uk:30282/uploadData' ,true);
	client.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	client.onreadystatechange = dataUploaded;
	client.send(postString);
}

// create the code to wait for the response from the data server, and process the response once it is received 
function dataUploaded(){
	// this function listens out for the server to say tha the data is ready 
	if (client.readyState == 4){
		// alert to show the response
		alert(client.responseText);
	}
}