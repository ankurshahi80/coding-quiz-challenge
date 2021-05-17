var startBtnEl = window.document.querySelector("#start-quiz");
var storeScoreBtnEl = document.getElementById("submit-score-btn");
var questionEl = document.querySelector("#question");
var startPageEl = document.querySelector("#start-page");
var questionIndex;
var feedbackEl = document.getElementById("feedback-text");
var feedbackBlockEl = document.getElementById("feedback-info");
var resultScreenEl = document.getElementById("result-screen");
var timerEl = document.getElementById("timer");
var timeLeft = 75;
var timeInterval;
var scoreEl = document.getElementById("score");
var initialInput = document.getElementById("initials");
var printHighScoreEl = document.getElementById("high-score-recall");
var printHighScoreSecEl = document.getElementById("show-high-scores");
var headerEl = document.getElementById("header");
var goBackBtnEl = document.getElementById("go-back-btn");
var clearHighScoreBtnEl = document.getElementById("clear-high-score-btn");

// Array to store high scores
var storeScore = [];

// Array to store quiz questions
var quizQuestions = [
    {
        count: 1,
        question:"Commonly used data types DO Not Include:",
        answer: "alerts",
        options:[
            "strings",
            "boolean",
            "alerts",
            "numbers"
        ]
    },
    {
        count:2,
        question: "The condition in an if/else statement is enclosed with ______________.",
        answer: "parenthesis",
        options: [
            "quotes",
            "curly brackets",
            "parenthesis",
            "square brackets"
        ]
    },
    {
        count:3,
        question:"Array's in JavaScript can be used to store _________.",
        answer:"all of the above",
        options: [
            "number and strings",
            "other arrays",
            "booleans",
            "all of the above"
        ]
    },
    {
        count:4,
        question:"String values must be enclosed within ______ when being assigned to variables.",
        answer: "quotes",
        options: [
            "commas",
            "curly brackets",
            "quotes",
            "parenthesis"
        ]
    },
    {
        count:5,
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        answer: "console.log",
        options: [
            "JavaScript",
            "terminal/bash",
            "for loops",
            "console.log"
        ]
    }
];

var startQuiz = function() {

    startPageEl.className="hide";
    questionIndex = 0;
    startTimer();
    getNextQuestion();
    
};

// countdown timer
function startTimer () {
    timeInterval = setInterval(function() {
        if (timeLeft>=1) {
            timerEl.innerHTML=timeLeft;
            timeLeft--;
        } else {
            timerEl.innerHTML=0;
            clearInterval(timeInterval);
        }
    }, 1000);
}

var getNextQuestion = function() {
    showQuestion(quizQuestions[questionIndex]);
}

// Function to display one question at a time
var showQuestion = function (question) {
    
    // display question
    var quesEl = window.document.createElement("h2");
    quesEl.textContent = question.question;
    questionEl.appendChild(quesEl);
    var correctChoice = question.answer;

    // display options as buttons
    for (var x=0; x<question.options.length; x++) {
        var optButtonEl = window.document.createElement("button");
        var optionNumber = x+1;
        var optionValue = question.options[x];
        optButtonEl.textContent = optionNumber + ". " +  optionValue;
        optButtonEl.className="option-item btn";
        if(optionValue === correctChoice) {
            optButtonEl.setAttribute("correct",true);
        }
        questionEl.appendChild(optButtonEl);
        optButtonEl.addEventListener("click", selectAnswer);
    };
}

// Function to validate the answer
var selectAnswer = function(event) {
    var selBtn = event.target;
    var correct = selBtn.getAttribute("correct");
    if(correct) {
        feedbackEl.innerHTML= "Correct!";
    } else {
        feedbackEl.innerHTML= "Wrong!";
        timeLeft=timeLeft-10;
        timerEl.innerHTML=timeLeft;
    }
    feedbackBlockEl.className= "show";
    if (questionIndex<(quizQuestions.length-1) && timeLeft>0) {
        questionIndex++;
        deleteCurrentQuestion();
        getNextQuestion();
    } else {
        deleteCurrentQuestion();
        clearInterval(timeInterval);
        displayResult();
    }
    
}
// function to delete the existing question before showing the next question
var deleteCurrentQuestion = function() {
    questionEl.innerHTML="";
}

// funtion to display the result
var displayResult = function(){
    resultScreenEl.className="show";
    scoreEl.innerHTML=timeLeft;
}

// function to save the final score in the local storage
var saveScore = function () {
    var highScore = timeLeft;
    var userName = initialInput.value;
    var scoreDataObj={
        name: userName, 
        score: highScore
    };
    storeScore = localStorage.getItem("score");
    if (!storeScore) {
        storeScore=[]
        storeScore.push(scoreDataObj);
    } else {
        storeScore = JSON.parse(storeScore);
        storeScore.push(scoreDataObj);
    }
    feedbackBlockEl.className="hide";
    localStorage.setItem("score", JSON.stringify(storeScore));
    // localStorage.setItem('highScore',highScore);
    renderHighScores();
}

// function to show the high scores
var renderHighScores = function() {

    resultScreenEl.className="hide";
    printHighScoreSecEl.className="show";
    headerEl.className="hide";
    // Retrieve the highScores from the local storage
    var savedScore = localStorage.getItem("score");
    savedScore = JSON.parse(savedScore);
    var highScorelistEl = document.createElement("li");
    for (var i=0; i<savedScore.length; i++) {
        var highScorelistEl = document.createElement("li");
        highScorelistEl.textContent=(i+1) + ". " + savedScore[i].name +" - " + savedScore[i].score;
        printHighScoreEl.appendChild(highScorelistEl);
    };
}

// function to go back and try again
var reset = function() {
    timeLeft = 75;
    printHighScoreSecEl.className="hide";
    headerEl.className="show";
    startQuiz();
}

// function to clear the local storage
var clearScore=function() {
    localStorage.setItem("score","");
}

// start quiz
startBtnEl.addEventListener("click",startQuiz);

// save and show high scores
storeScoreBtnEl.addEventListener("click",saveScore);

// go back to take the quiz
goBackBtnEl.addEventListener("click",reset);

// clear high score
clearHighScoreBtnEl.addEventListener("click", clearScore);

