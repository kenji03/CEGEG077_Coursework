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
	 var options = {watch:true,enableHighAccuracy:true,frequency:500};
	navigator.geolocation.watchPosition(onSuccess,onError,options);
 } else {
	document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
 }
}

var currentlocationlayer;
var myQuestions;
var Questions;
var test;
var quizContainer;
var resultsContainer;
var submitButton;

function onSuccess(position) {
	if (mymap.hasLayer(currentlocationlayer)){
		mymap.removeLayer(currentlocationlayer);
	}
	
	if (geoJSONlocations.length!==0){
		for (i in geoJSONlocations){
			lat = geoJSONlocations[i][1]
			lng = geoJSONlocations[i][0]
			var distance = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'K');
			if (distance < 0.05){
				// create function for creating quiz form
				myQuestions = [
				{
					question: geoJSONquestions[i],
					answers: {
						choice1: geoJSONchoices[i][0],
						choice2: geoJSONchoices[i][1],
						choice3: geoJSONchoices[i][2],
						choice4: geoJSONchoices[i][3],
					},
					correctAnswer: geoJSONanswers[i]
				},
				];
				
				if (Questions==undefined || isEquivalent(myQuestions,Questions)==false){
					confirm("you are close to a quiz point, you want to quiz??");
					Questions = myQuestions
					quizContainer = document.getElementById('quiz');
					resultsContainer = document.getElementById('results');
					submitButton = document.getElementById('submit');
					generateQuiz(myQuestions, quizContainer, resultsContainer, submitButton);
				}else if(isEquivalent(myQuestions,Questions)){
	
				}
						
			}
		}
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
		
	mymap.flyToBounds(currentlocationlayer.getBounds(),{maxZoom:18});
}

// onError Callback receives a PositionError object
function onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}

// add AJAX call and response method to code
var client;
function getGeoJSONfile(){
	client = new XMLHttpRequest();
	client.open('GET', 'http://developer.cege.ucl.ac.uk:30282/getGeoJSONfile' ,true);
	client.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	client.onreadystatechange = geoJSONResponse;
	client.send();
}

// create the code to wait for the response from the data server, and process the response once it is received
function geoJSONResponse() {
	// this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client.readyState == 4) {
	  // once the data is ready, process the data
	  var geoJSONString = client.responseText;
	  processGeoJSONfile(geoJSONString);
  }
}

var geoJSONquestions = [];
var geoJSONchoices = [];
var geoJSONlocations = [];
var geoJSONanswers = [];
// get GeoJSON file from database
function processGeoJSONfile(geoJSONString){
	alert("start processing")
	// convert the string of downloaded data to JSON
	var geoJSON = JSON.parse(geoJSONString);
	var questionpointlayer = L.geoJson(geoJSON,{
		// use point to layer to create the points
		pointToLayer: function (feature, latlng){
			// look at the GeoJSON file - specifically at the properties - to see the earthquake magnitude and use a different marker depending on this value
			// also include a pop-up that shows the place value of the earthquakes
			geoJSONquestions.push([feature.properties.question])
			geoJSONchoices.push([feature.properties.choice_1,feature.properties.choice_2,feature.properties.choice_3,feature.properties.choice_4])
			geoJSONlocations.push([latlng.lng,latlng.lat])
			geoJSONanswers.push([feature.properties.correct_answer])
			
			return L.marker(latlng, {icon:testMarkerBlue}).bindPopup("<b>"+"Name: "+feature.properties.first_name+" "+feature.properties.last_name+"<br />"+feature.properties.module_code+"</b>");
		},
    }).addTo(mymap);
}

var testMarkerBlue = L.AwesomeMarkers.icon({
    icon: 'play',
    markerColor: 'blue'
    });


function generateQuiz(questions, quizContainer, resultsContainer, submitButton){

    function showQuestions(questions, quizContainer){
        // we'll need a place to store the output and the answer choices
        var output = [];
        var answers;

        // for each question...
        for(var i=0; i<questions.length; i++){
            
            // first reset the list of answers
            answers = [];

            // for each available answer...
            for(letter in questions[i].answers){

                // ...add an html radio button
                answers.push(
                    '<label>'
                        + '<input type="radio" name="question'+i+'" value="'+letter+'">'
                        + letter + ': '
                        + questions[i].answers[letter]
                    + '</label><br />'
                );
            }
            // add this question and its answers to the output
            output.push(
                '<div class="question">' + questions[i].question + '</div>'
                + '<div class="answers">' + answers.join('') + '</div>'
            );
        }

        // finally combine our output list into one string of html and put it on the page
        quizContainer.innerHTML = output.join('');
    }


    function showResults(questions, quizContainer, resultsContainer){
        
        // gather answer containers from our quiz
        var answerContainers = quizContainer.querySelectorAll('.answers');
        
        // keep track of user's answers
        var userAnswer = '';
        
        // for each question...
        for(var i=0; i<questions.length; i++){
			
            userAnswer = (answerContainers[i].querySelector('input[name=question'+i+']:checked')||{}).value;
            // alert(questions[i].correctAnswer);
			// alert(userAnswer);
            // if answer is correct
            if(userAnswer==questions[i].correctAnswer){
                // add to the number of correct answers
                resultsContainer.innerHTML = 'Correct';
                
                // color the answers green
                answerContainers[i].style.color = 'lightgreen';
            }
            // if answer is wrong or blank
            else{
				resultsContainer.innerHTML = 'Incorrect';
                // color the answers red
                answerContainers[i].style.color = 'red';
            }
        }
    }

    // show questions right away
    showQuestions(questions, quizContainer);
    
    // on submit, show results
    submitButton.onclick = function(){
        showResults(questions, quizContainer, resultsContainer);
    }

}
		

function retakeQuiz(){
	generateQuiz(myQuestions, quizContainer, resultsContainer, submitButton);
	quizContainer = document.getElementById('quiz');
	resultsContainer = document.getElementById('results');
	submitButton = document.getElementById('submit');	
}

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a[0]);
    var bProps = Object.getOwnPropertyNames(b[0]);
	// alert(aProps[2]);
	// alert(bProps.length);
    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
		// alert(aProps.length);
		// alert(bProps.length);
        return false;
    }
    for (var i= 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[0].propName !== b[0].propName) {
			alert(a[0].propName);
			alert(b[0].propName);
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}
