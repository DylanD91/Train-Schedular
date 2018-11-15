$(document).ready(function(){
    // Initialize Firebase

   var config = {
     apiKey: "AIzaSyDp37mSys0kAlTxH1Ax33vtHrvPsHK9390",
     authDomain: "train-schedular-4b23a.firebaseapp.com",
     databaseURL: "https://train-schedular-4b23a.firebaseio.com",
     projectId: "train-schedular-4b23a",
     storageBucket: " ",
     messagingSenderId: "509111326048"
   };
   firebase.initializeApp(config);
  
    //   Database variable
      var database = firebase.database();
  
      // The variables for onClick events
      var name;
      var destination;
      var firstTrain;
      var frequency = 0;
  
      $("#add-train").on("click", function() {
          event.preventDefault();
          // This is where we store and retrieve new data from Trains
          name = $("#train-name").val().trim();
          destination = $("#destination").val().trim();
          firstTrain = $("#first-train").val().trim();
          frequency = $("#frequency").val().trim();
  
          // Pushing to database
          database.ref().push({
              name: name,
              destination: destination,
              firstTrain: firstTrain,
              frequency: frequency,
              dateAdded: firebase.database.ServerValue.TIMESTAMP
          });
          $("form")[0].reset();
      });
  
      database.ref().on("child_added", function(childSnapshot) {
          var nextArr;
          var minAway;
          // Change year so first train comes before now
          var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
          // Difference between the first and current trains
          var diffTime = moment().diff(moment(firstTrainNew), "minutes");
          var remainder = diffTime % childSnapshot.val().frequency;
          // How many minutes are left until the next train
          var minAway = childSnapshot.val().frequency - remainder;
          // This is where the next train time is
          var nextTrain = moment().add(minAway, "minutes");
          nextTrain = moment(nextTrain).format("hh:mm");
  
          $("#add-row").append("<tr>"+ childSnapshot.val().name + "</tr>", 
                  "</td><td>" + childSnapshot.val().destination +
                  "</td><td>" + childSnapshot.val().frequency +
                  "</td><td>" + childSnapshot.val().firstTrain +
                  "</td><td>" + childSnapshot.val().minutesAway + "</td></tr>");
  
              //This is where the errors are resolved
          }, function(errorObject) {
              console.log("Errors handled: " + errorObject.code);
      });
  
      database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
          // Change the HTML to reflect
          $("#name-display").html(snapshot.val().name);
          $("#email-display").html(snapshot.val().email);
          $("#age-display").html(snapshot.val().age);
          $("#comment-display").html(snapshot.val().comment);
      });
  });
 