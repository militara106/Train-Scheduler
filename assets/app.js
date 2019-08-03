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


    // Submit
    $("#submit").on("click", function () {
        // Prevent Default Submit button action
        event.preventDefault();

        // Variabels from form
        tName = $('#input-name').val().trim();
        tDest = $('#input-destination').val().trim();

        tTime = $('#input-time').val().trim();
        tTime = moment(tTime).format("HH:mm");

        tFreq = $('#input-frequency').val().trim();
        tFreq = moment(tFreq).format("HH:mm");

        console.log(tName);
        console.log(tDest);
        console.log(tTime);
        console.log(tFreq);

        // Calculate next arrival
        tNext = tTime;
        while (tNext != moment().format("HH:mm")) {
            if (tNext < moment().format("HH:mm")) {
                tNext = tTime + tFreq;
            } else {
                tNext = tTime;
            }
        }

        // Calculate minutes away
        tAway = moment().diff(moment(tNext, "mm"), "minutes");
        console.log("Minutes Away: " + tNext);

        // Push to database
        database.ref().push({
            name: tName,
            destination: tDest,
            frequency: tFreq,
            next: tNext,
            away: tAway,
        });

        // Clear Form
        $('#input-name').val('');
        $('#input-destination').val('');
        $('#input-time').val('');
        $('#input-frequency').val('');
    });

    database.ref().on("child_added", function (childSnapshot) {
        // Log everything that's coming out of snapshot

        var array = [childSnapshot.val().name, childSnapshot.val().destination, childSnapshot.val().frequency, childSnapshot.val().next, childSnapshot.val().away]

        var row = $("<tr>");

        for (var i = 0; i < array.length; i++) {
            console.log(array[i]);
            var cell = $("<td>");
            $(cell).text(array[i]);
            $(row).append(cell);
        }

        $("#currentTrian").append(row);

        // console.log(childSnapshot.val().name);
        // console.log(childSnapshot.val().destination);
        // console.log(childSnapshot.val().frequency);
        // console.log(childSnapshot.val().next);
        // console.log(childSnapshot.val().away);

        // var row = $("<tr>");
        // var cell1 = $("<td>");
        // var cell2 = $("<td>");
        // var cell3 = $("<td>");
        // var cell4 = $("<td>");
        // var cell5 = $("<td>");

        // $(cell1).text(childSnapshot.val().name);
        // $(cell2).text(childSnapshot.val().destination);
        // $(cell3).text(childSnapshot.val().frequency);
        // $(cell4).text(childSnapshot.val().next);
        // $(cell5).text(childSnapshot.val().away);

        // $(row).append(cell1);
        // $(row).append(cell2);
        // $(row).append(cell3);
        // $(row).append(cell4);
        // $(row).append(cell5);

        // $("#currentTrain").append(row);
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});