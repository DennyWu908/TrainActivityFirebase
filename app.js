// Initialize Firebase

var config = {
	apiKey: "AIzaSyD6aYR5s1JyREQGGj-PzIz2tkKiii3NWBw",
    authDomain: "train-scheduler-assignme-e9397.firebaseapp.com",
    databaseURL: "https://train-scheduler-assignme-e9397.firebaseio.com",
    projectId: "train-scheduler-assignme-e9397",
    storageBucket: "train-scheduler-assignme-e9397.appspot.com",
    messagingSenderId: "36786468944"
};

firebase.initializeApp(config);

// Creating a variable to store info from Firebase database in. Also setting default values for variables.

var database = firebase.database();

var trainName = "";
var destination = "";
var frequency = 0;
var firstArrival = "";
var nextArrival = "";
var minutesAway = 0;

// When a user submits information by clicking the "add-train" button, it will be appended to the table on the webpage. It will also be added to the Firebase database. As noted on the HTML file, the time for the arrival of the first train will not be displayed above, but the info under "Next Arrival" and "Minutes Away" will be based on it.

$("#add-train").on("click", function(event) {

	// Preventing the webpage from restarting.

	event.preventDefault();

	// The defaults for the following variables will be replaced with info on trains from the HTML form.

	trainName = $("#name-input").val().trim();
	destination = $("#place-input").val().trim();
	frequency = $("#frequency-input").val().trim();
	firstArrival = $("#time-input").val().trim();

	// Convert the difference between the time of the first train arrival and the current time into minutes. Divide this number by the frequency. The remainder should be a fraction of the frequency. Convert this number to minutes. The result should be the correct value for "Minutes Away". Add this number of minutes to the current time for the time of the next train arrival.

	// A new row on the table will be created for the info submitted by the user. The name, destination, and frequency of each train will be added to a column on the row. Then the row will be appended to the table.

	var trElement = $("<tr>")
	var tdName = $("<td>" + trainName + "</td>")
	var tdDestination = $("<td>" + destination + "</td>")
	var tdFrequency = $("<td>" + frequency + "</td>")

	// There have to be two additional variables to add columns for the values of "Minutes Away" and "Next Arrival". Similarly, these values need to be pushed to the database.
	
	trElement.append(tdName)
	trElement.append(tdDestination)
	trElement.append(tdFrequency)

	$("#table-body").append(trElement)

	// Adding info on trains to the database.

	database.ref().push({

		trainName: trainName,
		destination: destination,
		frequency: frequency

	})

	// After the information is submitted, the fields for doing so on the form will be cleared.

	$("#name-input").val("");
	$("#place-input").val("");
	$("#frequency-input").val("");
	$("#time-input").val("");

})

// This function will retrieve info on trains from the database and log them to the console. It will also display an error message, if necessary.

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

	var sv = snapshot.val();

	console.log(sv.trainName);
	console.log(sv.destination);
	console.log(sv.frequency);

}, function(errorObject) {

      console.log("Errors handled: " + errorObject.code);
      
});

// The following two variables will track the number of clients connected to the web page. "connectionsRef" will be updated when a client's connection state changes.

var connectionsRef = database.ref("/connections");

// The value of this variable is a boolean, which will change from true to false, depending on whether a client is connected to this web page.

var connectedRef = database.ref(".info/connected");

// This function will add a user to the connections list when they connect, and remove them after they disconnect.

connectedRef.on("value", function(snap) {

  if (snap.val()) {

    var con = connectionsRef.push(true);

    con.onDisconnect().remove();
  }

});

// If the connections list changes, this function will update the number of users connected to the webpage. The number of children in the connections list will be displayed on the "admin-count" div.

connectionsRef.on("value", function(snap) {

  $("#admin-count").html("Connected Administrators: " + snap.numChildren());

});