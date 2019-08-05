$(document).ready(function () {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyCHatyz2WEu-fQ_WrBAQrVAqvS42mlY9VA",
        authDomain: "train-scheduler-197d6.firebaseapp.com",
        databaseURL: "https://train-scheduler-197d6.firebaseio.com",
        projectId: "train-scheduler-197d6",
        storageBucket: "",
        messagingSenderId: "489388376846",
        appId: "1:489388376846:web:31c5d7a6ef9f2c9e"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // Create a variable to reference the database.
    var database = firebase.database();

    // Variables
    var tName;
    var tDest;
    var tTime;
    var tFreq;
    var tNext;
    var tAway;

    // Validate input
    function validate() {
        tTime = $('#input-time').val().trim();
        tFreq = $('#input-frequency').val().trim();

        if (moment(tTime, "HH:mm").isValid() == false || tFreq > 60 || isNaN(tFreq) == true) {
            console.log("Validated false");
            return false;
        } else {
            console.log("Validated true");
            return true;
        }
    }


    // Submit
    $("#submit").on("click", function () {
        // Prevent Default Submit button action
        event.preventDefault();

        // Check for valid input
        if (validate() == true) {
            // Variabels from form
            tName = $('#input-name').val().trim();
            tDest = $('#input-destination').val().trim();

            tTime = $('#input-time').val().trim();
            tTime = moment(tTime, "HH:mm").format("HH:mm");

            tFreq = $('#input-frequency').val().trim();

            console.log("Name Input: " + tName);
            console.log("Destination Input: " + tDest);
            console.log("First Train: " + tTime);
            console.log("Frequency Input: " + tFreq);

            // Calculate Next Arrival
            while (moment(tNext, "HH:mm") < moment()) {
                tNext = moment(tNext, "HH:mm").add(tFreq, "minutes");
            }
            if (moment(tNext, "HH:mm") > moment("23:59", "HH:mm")) {
                tNext = "Tomorrow at " + childSnapshot.val().time;
            } else {
                tNext = moment(tNext, "HH:mm").format("HH:mm");
            }
            console.log("Calculated next arrival: " + tNext);

            // Calculate minutes away
            tAway = moment(tNext, "HH:mm").diff(moment(), "minutes");
            tAway = Math.abs(tAway);
            console.log("Minutes Away: " + tAway);

            // Push to database
            database.ref().push({
                name: tName,
                destination: tDest,
                frequency: tFreq,
                time: tTime
            });

            // Clear Form
            $('#input-name').val('');
            $('#input-destination').val('');
            $('#input-time').val('');
            $('#input-frequency').val('');
        } else {
            alert("Time or Frequency not in correct format");
        }
    });

    database.ref().on("child_added", function (childSnapshot) {

        // Log Data
        console.log("DATA PULLED-------------------------" + childSnapshot.val().name);
        console.log("Destination: " + childSnapshot.val().destination);
        console.log("Frequency: " + childSnapshot.val().frequency);


        tNext = childSnapshot.val().time;
        console.log("First Train: " + tNext);
        tNext = moment(tNext, "HH:mm").format("HH:mm");
        tFreq = childSnapshot.val().frequency;

        // Calculate Next Arrival
        while (moment(tNext, "HH:mm") < moment()) {
            tNext = moment(tNext, "HH:mm").add(tFreq, "minutes");
        }
        if (moment(tNext, "HH:mm") > moment("23:59", "HH:mm")) {
            tNext = "Tomorrow at " + childSnapshot.val().time;
        } else {
            tNext = moment(tNext, "HH:mm").format("HH:mm");
        }
        console.log("Calculated next arrival: " + tNext);

        // Calculate minutes away
        tAway = moment(tNext, "HH:mm").diff(moment(), "minutes");
        tAway = Math.abs(tAway);
        console.log("Minutes Away: " + tAway);

        // Create Objects
        var row = $("<tr>");
        var cell1 = $("<td>");
        var cell2 = $("<td>");
        var cell3 = $("<td>");
        var cell4 = $("<td>");
        var cell5 = $("<td>");

        // Add data to rows
        $(cell1).text(childSnapshot.val().name);
        $(cell2).text(childSnapshot.val().destination);
        $(cell3).text(childSnapshot.val().frequency);
        $(cell4).text(tNext);
        $(cell5).text(tAway);

        $(row).append(cell1);
        $(row).append(cell2);
        $(row).append(cell3);
        $(row).append(cell4);
        $(row).append(cell5);

        // Add row to container
        $("#currentTrain").append(row);
        
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});