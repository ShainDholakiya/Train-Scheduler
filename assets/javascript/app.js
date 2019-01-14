// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCgqpQsLuBHLLUy1sNwng51yGHBmhB6-vA",
    authDomain: "train-scheduler-4d7ce.firebaseapp.com",
    databaseURL: "https://train-scheduler-4d7ce.firebaseio.com",
    projectId: "train-scheduler-4d7ce",
    storageBucket: "train-scheduler-4d7ce.appspot.com",
    messagingSenderId: "145519123144"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding Employees
  $("#submit-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainTime = moment($("#time-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding employee data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      time: trainTime,
      frequency: trainFrequency
    };
  
    // Uploads employee data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;
  
    // Employee Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainTime);
    console.log(trainFrequency);
  
    // Time with momentn (pushed back 1 year to make sure it comes before current time)
    var timeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
    console.log(timeConverted);
   
    // Difference between the times
    var timeDifferent = moment().diff(moment(timeConverted), "minutes");
    console.log(timeDifferent);
   
    // Time apart (remainder)
    var timeRemainder = timeDifferent % trainFrequency;
    console.log(timeRemainder);
   
    // Minutes until train
    var trainAway = trainFrequency - timeRemainder;
    console.log(trainAway);
   
    // Next train
    var arrival = moment().add(trainAway, "minutes");
   
    var trainArrival = moment(arrival).format("hh:mm A");
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(trainArrival),
      $("<td>").text(trainAway)
    );
  
    // Append the new row to the table
    $("#train-table > tbody").prepend(newRow);
  });
  