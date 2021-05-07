const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const tip = document.getElementById('tip');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let i = false;
let questions = [];
const category = document.getElementById('category');
const comment = document.getElementById('comment');
const difficulty = document.getElementById('difficulty');
const id = localStorage.getItem('userID')

let topic = localStorage.getItem('topic')

console.log(topic)


const myModal = new HystModal({
    linkAttributeName: 'data-hystmodal',
    catchFocus: true,
    waitTransitions: true,
    closeOnEsc: true,
    beforeOpen: function(modal){
      
    },
    afterClose: function(modal){
        getNewQuestion();
    },
});

fetch(`https://gmfi-080221-default-rtdb.firebaseio.com/topics/${topic}.json`)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
                category: loadedQuestion.category,
                comment: loadedQuestion.comment,
                difficulty: loadedQuestion.difficulty,
            };
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        
        startGame();
    })
    
   
//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        //localStorage.setItem('mostRecentScore', score);
        localStorage.removeItem('topic')
        localStorage.setItem('notFirstTime', 1)
        localStorage.setItem('lastScore', score)
        return window.location.assign('/welcome.html');
    }
    questionCounter++;
    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    comment.innerHTML = currentQuestion.comment.commentPart;
    category.innerHTML = currentQuestion.category;
    difficulty.innerHTML = currentQuestion.difficulty;
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

question.addEventListener('click', () => {
    
    if (!i) {question.innerHTML = currentQuestion.answer; i=true} 
    else {question.innerHTML = currentQuestion.question; i=false}
})




choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
            selectedChoice.parentElement.classList.add(classToApply);
            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply);
                getNewQuestion();
            }, 500);
        }
        else {
            selectedChoice.parentElement.classList.add(classToApply);
            setTimeout(() => {
                myModal.open('#myModal');
                selectedChoice.parentElement.classList.remove(classToApply);
            }, 500);
            };
        });   
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
 


