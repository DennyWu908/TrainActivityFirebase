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

var database = firebase.database();

var trainName = "";
var destination = "";
var frequency = 0;
var firstArrival = "";
var nextArrival = "";
var minutesAway = 0;

$("#add-train").on("click", function(event) {

	event.preventDefault();

	trainName = $("#name-input").val().trim();
	destination = $("#place-input").val().trim();
	frequency = $("#frequency-input").val().trim();
	firstArrival = $("#time-input").val().trim();

	var trElement = $("<tr>")
	var tdName = $("<td>" + trainName + "</td>")
	var tdDestination = $("<td>" + destination + "</td>")
	var tdFrequency = $("<td>" + frequency + "</td>")
	
	trElement.append(tdName)
	trElement.append(tdDestination)
	trElement.append(tdFrequency)

	$("#table-body").append(trElement)

	database.ref().push({

		trainName: trainName,
		destination: destination,
		frequency: frequency

	})

	$("#name-input").val("");
	$("#place-input").val("");
	$("#frequency-input").val("");
	$("#time-input").val("");

})

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

	var sv = snapshot.val();

	console.log(sv.trainName);
	console.log(sv.destination);
	console.log(sv.frequency);

}, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
});

var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#admin-count").html("Connected Administrators: " + snap.numChildren());
});