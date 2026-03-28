const questions = [
{
question: "What does HTML stand for?",
answers: [
{text:"Hyper Text Markup Language", correct:true},
{text:"Home Tool Markup Language", correct:false},
{text:"Hyperlinks Text Mark Language", correct:false},
{text:"Hyper Tool Multi Language", correct:false}
]
},
{
question: "Which language is used for styling web pages?",
answers: [
{text:"HTML", correct:false},
{text:"CSS", correct:true},
{text:"Python", correct:false},
{text:"Java", correct:false}
]
},
{
question: "Which language runs in the browser?",
answers: [
{text:"Java", correct:false},
{text:"C", correct:false},
{text:"Python", correct:false},
{text:"JavaScript", correct:true}
]
}
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const resultText = document.getElementById("result");
const timerElement = document.getElementById("timer");
const progressElement = document.getElementById("progress");

const startBtn = document.getElementById("start-btn");
const quizDiv = document.getElementById("quiz");
const userInfo = document.getElementById("user-info");

const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll");

const leaderboardDiv = document.getElementById("leaderboard");
const leaderboardBody = document.getElementById("leaderboard-body");

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

let studentName = "";
let rollNumber = "";

/* VALIDATION */
function validateInputs(){
startBtn.disabled = !(nameInput.value.trim() && rollInput.value.trim());
}
nameInput.addEventListener("input", validateInputs);
rollInput.addEventListener("input", validateInputs);

/* START */
startBtn.addEventListener("click", () => {
studentName = nameInput.value;
rollNumber = rollInput.value;

userInfo.style.display = "none";
quizDiv.style.display = "block";

startQuiz();
});

function startQuiz(){
currentQuestionIndex = 0;
score = 0;
nextButton.innerHTML = "Next";
showQuestion();
}

/* QUESTION */
function showQuestion(){
resetState();
startTimer();

let currentQuestion = questions[currentQuestionIndex];
progressElement.innerHTML =
"Question " + (currentQuestionIndex+1) + "/" + questions.length;

questionElement.innerHTML = currentQuestion.question;

currentQuestion.answers.forEach(answer => {
const button = document.createElement("button");
button.innerHTML = answer.text;
button.classList.add("btn");
answerButtons.appendChild(button);

if(answer.correct){
button.dataset.correct = "true";
}

button.addEventListener("click", selectAnswer);
});
}

/* RESET */
function resetState(){
nextButton.style.display = "none";
answerButtons.innerHTML = "";
resultText.innerHTML = "";
}

/* TIMER */
function startTimer(){
timeLeft = 15;
timerElement.innerHTML = "Time: " + timeLeft;

clearInterval(timer);

timer = setInterval(() => {
timeLeft--;
timerElement.innerHTML = "Time: " + timeLeft;

if(timeLeft === 0){
clearInterval(timer);
timeUp();
}
}, 1000);
}

/* TIME UP */
function timeUp(){
let correctAnswer = "";

Array.from(answerButtons.children).forEach(btn => {
if(btn.dataset.correct === "true"){
btn.style.backgroundColor = "green";
correctAnswer = btn.innerHTML;
}
btn.disabled = true;
});

resultText.innerHTML =
"Time's up! Correct Answer: " + correctAnswer;

nextButton.style.display = "block";
}

/* ANSWER */
function selectAnswer(e){

clearInterval(timer);

const selectedBtn = e.target;
const isCorrect = selectedBtn.dataset.correct === "true";

let correctAnswer = "";

if(isCorrect){
selectedBtn.style.backgroundColor = "green";
resultText.innerHTML = "Correct Answer!";
score++;
}else{
selectedBtn.style.backgroundColor = "red";

Array.from(answerButtons.children).forEach(btn => {
if(btn.dataset.correct === "true"){
btn.style.backgroundColor = "green";
correctAnswer = btn.innerHTML;
}
});

resultText.innerHTML =
"Wrong Answer! Correct Answer: " + correctAnswer;
}

Array.from(answerButtons.children).forEach(btn => {
btn.disabled = true;
});

nextButton.style.display = "block";
}

/* SCORE */
function showScore(){

let percent = ((score / questions.length) * 100).toFixed(1);

let results = JSON.parse(localStorage.getItem("quizResults")) || [];

results.push({
name: studentName,
roll: rollNumber,
score: score,
total: questions.length,
percentage: percent
});

localStorage.setItem("quizResults", JSON.stringify(results));

loadLeaderboard();
}

/* LEADERBOARD */
function loadLeaderboard(){

let data = JSON.parse(localStorage.getItem("quizResults")) || [];

data.sort((a, b) => b.score - a.score);

leaderboardBody.innerHTML = "";

data.forEach(student => {
const row = `
<tr>
<td>${student.name}</td>
<td>${student.roll}</td>
<td>${student.score}/${student.total}</td>
<td>${student.percentage}%</td>
</tr>
`;
leaderboardBody.innerHTML += row;
});

quizDiv.style.display = "none";
leaderboardDiv.style.display = "block";
}

/* NEXT */
function handleNext(){
currentQuestionIndex++;

if(currentQuestionIndex < questions.length){
showQuestion();
}else{
showScore();
}
}

nextButton.addEventListener("click", handleNext);

/* RESTART */
function restartApp(){
leaderboardDiv.style.display = "none";
userInfo.style.display = "block";

nameInput.value = "";
rollInput.value = "";
startBtn.disabled = true;
}