var config = {
  apiKey: "AIzaSyCCkUB9oTOgb91Sw92pWGVG90ku0fXkx4g",
  authDomain: "parkerson-project.firebaseapp.com",
  databaseURL: "https://parkerson-project.firebaseio.com",
  projectId: "parkerson-project",
  storageBucket: "",
  messagingSenderId: "342905401401"
};

firebase.initializeApp(config);

var testing = document.getElementById("testing");

var users = firebase.database().ref().child("users");
var respondents = firebase.database().ref();

var testObj = {}

users.on("child_added", function(snapshot) {
  testObj = snapshot.val();
});

respondents.on("child_added", function(snapshot) {
  window.respondentObject = snapshot.val();
});



$(".page").hide();
$(".intro").show();
$("#validForm").hide();

function start() {
  //Take Quiz button
  $(".intro").hide();
  $(".info").show();
  window.game = new Model();
  showQuestion(window.game.counter);

}

var Model = function() {
  this.name = "",
  this.grade = 0,
  this.counter = 0,
  this.responses = [],
  this.questions = [
    "I prefer to hang out with: ",
    "Are you an introvert or an extrovert?",
    "How do you spend your Friday nights?",
    "What is your favorite class?",
    "What is the best food in the cafeteria?",
    "Dream vacation?",
    "Favorite restaurant?",
    "Someone asks for money in the bookstore:",
    "During meetings, you can be found:",
    "I consider myself very attractive:",
    "Looks are very important to me:",
    "In the lunchroom, I sit at:",
    "If I could date a celebrity, I would date:",
    "Pick One:",
    "What is on your feet:",
    "Favorite social media:",
    "Saturdays are for the:",
    "What TV show do you watch?",
    "I would get a detention for:",
    "I describe my style as:",
    "My favorite piece of clothing is:",
    "My favorite sport to watch is:",
    "You can always find me at:",
    "To get ready in the morning, it takes me:",
    "Pick a movie to watch:",
    "I like to read:",
    "I can be found drinking:",
    "During the game, I can be found:",
    "Where are you taking this quiz?",
    "Choose one:"
  ],
    this.answers = [
      ["Underclassmen", "Upperclassmen", "Everyone"],
      ["Extrovert", "Introvert"],
      [
        "Partying with friends",
        "Partying alone",
        "Watching Netflix",
        "Completely and utterly alone"
      ],
      ["English", "Math", "Science", "Art"],
      ["Chicken Tenders", "Hamburgers", "Taco Tuesday", "Salad Bar"],
      ["Paris", "Mexico", "Greece", "Senior Spring Break"],
      ["Chipotle", "Spin", "Jalepenos", "Juns"],
      [
        "Lend them money and make them pay you back",
        "Tell them to get bent",
        "Buy for the whole store",
        "Report them to Kubiki"
      ],
      ["Library", "Commons", "Club Meeting", "Bookstore"],
      [
        "Very true",
        "Somewhat true",
        "False",
        "I cry when I look in the mirror"
      ],
      [
        "Very true",
        "Somewhat true",
        "False - personality is the only thing that matters"
      ],
      [
        "A long table",
        "A circular table",
        "The teacher's table",
        "I don't eat in the lunch room"
      ],
      ["Cara Delevingne", "Megan Fox", "Leonardo DiCaprio", "Harry Styles"],
      ["Crayon", "Pen", "Expo marker", "Sharpie"],
      ["Sneakers", "Sandals", "Boots", "No shoes"],
      ["Instagram", "Snapchat", "Twitter", "None"],
      ["Boys", "Girls", "Your mom", "What?"],
      [
        "Stranger Things",
        "Game of Thrones",
        "It's Always Sunny in Philadelphia",
        "Big Bag Theory"
      ],
      [
        "Being late to school",
        "Starting a fight",
        "Talking back to a teacher",
        "Skipping class"
      ],
      ["Trendy", "Comfortable", "Edgy", "Nonexistent"],
      ["Hand me down", "Designer", "From a significant other", "Handmade"],
      ["Basketball", "Football", "Baseball", "I don't watch sports"],
      ["The gym", "My bed", "A desk", "At practice"],
      ["5 minutes", "20 minutes", "45 minutes", "1 hour or longer"],
      ["Forrest Gump", "Good Will Hunting", "Sound of Music", "Superbad"],
      [
        "As much as possible",
        "Sometimes",
        "Never",
        "I haven't read a book in years"
      ],
      ["Water", "Coffee", "Tea", "Soda/Energy Drink"],
      ["On the field", "In the stands", "Cheerleading", "Not at the game"],
      ["In class", "At home", "During meetings", "I prefer not to say"],
      ["Respect", "Integrity", "Scholarship", "Compassion"]
    ];
};

function showQuestion(ind) {
  $("#Qbox").text(game.questions[ind]);

  for (var j = 1; j < game.answers[ind].length + 1; j++) {
    $("#a" + j).html(game.answers[ind][j-1]);
  }
  
  console.log(window.game.responses);
  
  
}


function chooseAnswer() {
  window.game.responses.push($(this).text());
  window.game.counter++;
  if (window.game.counter < window.game.questions.length){
    showQuestion(window.game.counter);
  } else {
    //record results, push to database, get match
    recordAnswers();
    console.log(window.respondentObject);
    compareAnswers();
  }
  
}

function recordAnswers(){
  users.push({
      name: window.game.name,
      grade: window.game.grade,
      answers: window.game.responses
  });
}

$(".answer").on("click", chooseAnswer);

function submitInfo(){
  //record names and emails to our object
  if (infoValid()){

    //move on to quiz
    $(".one").show();
  } else {
    $("#validForm").show();
  }

}

function infoValid(){
  var firstName = $('input[name="firstName"]').val().toLowerCase();
  var lastName = $('input[name="lastName"]').val().toLowerCase();

  if (firstName != "" && lastName != ""){

    window.game.name = firstName[0].toUpperCase() + firstName.substring(1) + " " + lastName[0].toUpperCase() + lastName.substring(1);

    console.log($('select[name="grade"]').val());
    window.game.grade = $('select[name="grade"]').val();
    return true;
  } else {
    return false;
  }

}

function compareAnswers(){

  var scores = [];
  var people = [];
  for(var person in window.respondentObject){
    people.push(window.respondentObject[person])
  }

  //remove this person from array
  for(var i=0; i<people.length; i++){
    if (people[i].name == window.game.name){
      people.splice(i, 1);
    }
  }
  console.log(people);


  for(var i=0; i<people.length; i++){
    var score = 0;
    for(var j=0; j<window.game.responses.length; j++){
      if(window.game.responses[j] == people[i].answers[j]){
        score++;
      }
    }
    scores.push(score);
  }


  console.log(Array.max(scores));
  console.log(scores.indexOf(Array.max(scores)));
  console.log(people[scores.indexOf(Array.max(scores))].name);

  $("#match").text(people[scores.indexOf(Array.max(scores))].name);
  $("#matchGrade").text(people[scores.indexOf(Array.max(scores))].grade);
  $(".page").hide();
  $(".results").show();
}

function clearUsers(){
  users.set({});
}



Array.max = function( array ){
    return Math.max.apply( Math, array );
};

