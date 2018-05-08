// add function to test that everything is working and upload it to the js sub directory
// create a function to get the first bit of text data from the from
function startDataUpload(){
	confirm("Start Data Upload");

	var locationname = document.getElementById("location_name").value;
	var firstname = document.getElementById("firstname").value;
	var lastname = document.getElementById("lastname").value;
	var selected_module = document.getElementById("moduleselectbox");
	alert(selected_module);
	var module = selected_module.options[selected_module.selectedIndex].text;
	var postString = "locationname="+locationname+"&firstname="+firstname +"&lastname=" +lastname +"&module=" +module;
	alert(firstname+" "+lastname+" "+module);
	
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
	
	if (locationname==undefined || firstname==undefined || lastname==undefined || module==undefined || choiceString==undefined || answer==undefined || latitude==undefined || longitude==undefined){
		alert("Some Entries might be Blank. Please Check Again");
	}else{
		alert(postString)
		processData(postString);
	}
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
	if (client.readyState == 3){
		// change the DIV to show the response
		document.getElementById("dataUploadResult").innerHTML = "Processing";
	}
	// this function listens out for the server to say tha the data is ready 
	if (client.readyState == 4){
		// change the DIV to show the response
		alert ("Upload is Ready")
		document.getElementById("dataUploadResult").innerHTML = client.responseText;
	}
}