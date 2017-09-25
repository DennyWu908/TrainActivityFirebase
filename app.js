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

		trainName: trainName
		destination: destination
		frequency: frequency
	})
})