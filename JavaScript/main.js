const categorySect = document.getElementById('category');
const form = document.getElementById('main-form');
const mainDiv = document.getElementById('main-div');
const player = document.getElementById('name');

let questions;
let score = 0;
let correctAnswer;

const categoryTrivia = async () => {
    try {
        const response = await fetch("https://opentdb.com/api_category.php")
        const result = await response.json();
    
        result.trivia_categories.forEach( element => {
        const options = document.createElement('option');
        const optionsValue = document.createAttribute('value');
        optionsValue.value = element.id;
        options.setAttributeNode(optionsValue);
        options.innerHTML = element.name;
        categorySect.appendChild(options);
    })
    } catch(error) {
        console.log(error)
    }
};

const triviaUrl = e => {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const category = categorySect.value;
    const type = document.getElementById('question').value;
    const difficulty = document.getElementById('difficulty').value;
    const trivia = `https://opentdb.com/api.php?amount=${amount}&category=${category}&type=${type}&difficulty=${difficulty}`;
    triviaFuntion(trivia);
};

const triviaFuntion = trivia => {

    fetch(trivia)
        .then(response => response.json())
        .then(result => getQuestions(result))
        .catch(error => console.log(error));
    toggleForm();
    
};

const toggleForm = () => {
    form.classList.toggle('invisible');
};

const getQuestions = result => {
    questions = result.results;
    questionsSelected();
    // setTimer();
};

const questionsSelected = () => {

    let t = 10000
    
    const divShow = questions.forEach((element, index, arr) => setTimeout(() => {
        
        const div = document.createElement('div');
        div.classList.add('top', 'questions-container');

            const categoryQ = document.createElement('h4');
            categoryQ.innerHTML = element.category;
            div.appendChild(categoryQ);
        
            const questionsQ = document.createElement('h2');
            questionsQ.innerHTML = element.question;
            div.appendChild(questionsQ);

            correctAnswer = element.correct_answer;

                const correct = document.createElement('button');
                correct.innerHTML = element.correct_answer;
                const correctValue = document.createAttribute('onClick');
                correctValue.value = "handleCorrectAnswer(this)";
                correct.setAttributeNode(correctValue);
                div.appendChild(correct);
            
            const answers = () => {

                if(element.incorrect_answers.length >= 1) {
                    element.incorrect_answers.forEach(iterator => {
                        const incorrectButton = document.createElement('button');
                        incorrectButton.innerHTML = iterator;
                        const incorrectValue = document.createAttribute('onClick');
                        incorrectValue.value = "handleCheckAnswer(this)";
                        incorrectButton.setAttributeNode(incorrectValue);
                        div.appendChild(incorrectButton);
                    })
                }else{
                    const singleBtnIncorrect = document.createElement('button');
                    singleBtnIncorrect.innerHTML = element.incorrect_answers;
                    const singleincorrectValue = document.createAttribute('onClick');
                    singleincorrectValue.value = "handleCheckAnswer(this)";
                    singleBtnIncorrect.setAttributeNode(singleincorrectValue);
                    div.appendChild(singleBtnIncorrect);
                }
                
            
            }
            answers();
            
        mainDiv.appendChild(div);

        setTimeout(() => {
            div.classList.add('invisible')
        }, t);

        
        setTimeout(() => {
            lastWindow();
        }, arr.length * t)

    }, index * t ))
    
    
};

const handleCorrectAnswer = correct => {

    if (correct.innerText === correctAnswer) {
      score++;
      console.log("Correcto");
    }

};

const handleCheckAnswer = button => {

    if (button) {
        console.log("Incorrecto");
    }

};

const lastWindow = () => {
    const finalDiv = document.createElement('div');
    finalDiv.classList.add('top');

        const last = document.createElement('h2');
        last.innerHTML = `Well done !`;
        finalDiv.appendChild(last);

        const finalScore = document.createElement('p');
        finalScore.innerHTML =  `Game over. This is your score: ${score}`;
        finalDiv.appendChild(finalScore);

    mainDiv.appendChild(finalDiv);
};

categoryTrivia();
form.onsubmit = triviaUrl