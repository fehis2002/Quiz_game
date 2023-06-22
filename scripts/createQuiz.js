const global = {
    MAXIMUM_AMOUNT_OF_QUESTION: 1,
    amountOfQuestions: 0,
    timoutID: 0,
    QUIZES: [],
    CURRENT_QUESTIONS_LIST: []

}

const setup = () => {
    displayTypeOfQuestions();

    //checking whether a local storage exists
    if(JSON.parse(localStorage.getItem('quizes')) === null) {
        localStorage.setItem('quizes', JSON.stringify([]))
    }
}

const displayTypeOfQuestions = () => {

    let div = document.getElementById('content');

    let title = document.createElement('h2');
    let titleText = document.createTextNode('Choose the type of question');
    title.appendChild(titleText);

    div.appendChild(title);

    let typeOfQuestions = ['open question', 'question with one answer', 'question with multiple answers'];
    for (let type of typeOfQuestions) {
        let button = document.createElement('button');
        if (type === 'open question') {
            button.addEventListener('click', displayOpenQuestionSetting);
        } else if (type === 'question with one answer') {
            button.addEventListener('click', () => {
                displayGeneralQuestion(type, 3);
            });
        } else {
            button.addEventListener('click', () => {
                displayGeneralQuestion(type, 4);
            });
        }
        let text = document.createTextNode(type);
        button.appendChild(text);
        div.appendChild(button);
    }


}

const generateQuestionSetting = () => {
    //clearing page
    let div = document.getElementById('content');
    div.innerHTML = '';

    //Generate question
    let label = document.createElement('label');
    let labelText = document.createTextNode('Question: ');
    let question = document.createElement('textarea');

    label.appendChild(labelText);

    question.style.height = '50px';
    question.style.width = '300px';


    div.appendChild(label);
    div.appendChild(document.createElement('br'));
    div.appendChild(question);
    div.appendChild(document.createElement('br'));
    return div;
}

const displaySubmitButtonSetting = (type, div) => {
    //submit question
    let button = document.createElement('button');
    let buttonText = document.createTextNode('Next Question');
    button.addEventListener('click', () => {
        clearTimeout(global.timoutID);
        if (validate(type)) {
            global.CURRENT_QUESTIONS_LIST.push(createQuestion(type));
            global.amountOfQuestions++;
            div.innerHTML = '';
            displayTypeOfQuestions();
        }

        if(global.CURRENT_QUESTIONS_LIST.length !== 0 && global.amountOfQuestions === global.MAXIMUM_AMOUNT_OF_QUESTION) {
            div.innerHTML = '';
            generateTitleOption(global.CURRENT_QUESTIONS_LIST);
        }
    });

    button.appendChild(buttonText);
    div.appendChild(button)
}

const displayOpenQuestionSetting = () => {

    let div = generateQuestionSetting();

    //Answer
    let label2 = document.createElement('label');
    let label2Text = document.createTextNode('Answer: ');
    let answer = document.createElement('textarea');

    label2.appendChild(label2Text)
    div.appendChild(label2);
    div.appendChild(document.createElement('br'));
    div.appendChild(answer);
    div.appendChild(document.createElement('br'));

    answer.style.height = '50px';
    answer.style.width = '300px';

    displaySubmitButtonSetting('open question', div);

}

const displayGeneralQuestion = (type, amountOfAnswers) => {

    let div = generateQuestionSetting();

    //Answer
    let label2 = document.createElement('label');
    let label2Text = document.createTextNode('Answer: ');

    label2.appendChild(label2Text);
    div.appendChild(label2);
    div.appendChild(document.createElement('br'));

    for (let i = 0; i < amountOfAnswers; i++) {
        let answerContainter = document.createElement('div');
        answerContainter.classList.add('answer');
        let answer = document.createElement('input');
        answer.setAttribute('type', 'text');
        answer.classList.add('answerGeneralQuestion');
        let check = document.createElement('button');
        let checkToken = document.createTextNode('✔');
        let cross = document.createElement('button');
        let crossToken = document.createTextNode('𐄂');

        check.addEventListener('click', () => {
            answerContainter.classList.add('correct');
            answer.style.border = '5px green solid';
        });

        cross.addEventListener('click', () => {
            answerContainter.classList.remove('correct');
            answer.style.border = '';
        });

        check.classList.add('smallButton');
        cross.classList.add('smallButton');
        cross.appendChild(crossToken);
        check.appendChild(checkToken);
        answerContainter.appendChild(check);
        answerContainter.appendChild(answer);
        answerContainter.appendChild(cross);
        div.appendChild(answerContainter);
        div.appendChild(document.createElement('br'));
    }

    displaySubmitButtonSetting(type, div);

}

const checkIfAnswersAreEmpty = () => {
    let empty = false;
    let answers = document.querySelectorAll('div#content > div > input');
    let i = 0;
    // checking if answers are empty
    while (!empty && i < answers.length) {
        if (answers[i].value === '') {
            empty = true;
        }
        i++;
    }
    return empty;
}

const getAmountOfCorrectAnswers = () => {
    let answerContainers = document.querySelectorAll('div#content > div');
    let count = 0;
    for (let i = 0; i < answerContainers.length; i++) {
        if (answerContainers[i].classList.contains('correct')) {
            count++;
        }
    }
    return count;
}

const validate = type => {

    let invalid = false;
    let error = document.createElement('p');
    let errorText;

    //validating question
    if (document.getElementsByTagName('textarea')[0].value === '') {
        errorText = document.createTextNode('The question is empty.');
        document.getElementsByTagName('textarea')[0].style.border = 'red 2px solid';
        invalid = true;
    } else {
        document.getElementsByTagName('textarea')[0].style.border = '';
    }
    //validating answers
    if (!invalid && type === 'open question') {
        let textAreas = document.getElementsByTagName('textarea');
        if (textAreas[0].value === '' && textAreas[1].value === '') {
            errorText = document.createTextNode('The question and answer are empty');
            textAreas[0].style.border = 'red 2px solid';
            textAreas[1].style.border = 'red 2px solid';
            invalid = true;
        } else if (textAreas[1].value === '') {
            errorText = document.createTextNode('The answer is empty.');
            textAreas[1].style.border = 'red 2px solid';
            invalid = true;
        }
    } else if (!invalid && type === 'question with one answer') {
        invalid = checkIfAnswersAreEmpty();
        if (invalid) {
            errorText = document.createTextNode('There is at least one answer that is empty.');
        }

        if(!invalid) {
            // checking if one answer is selected as correct
            if (getAmountOfCorrectAnswers() !== 1) {
                errorText = document.createTextNode('You have to select one answer that can be correct');
                invalid = true;
            }
        }
    } else if (!invalid && type === 'question with multiple answers') {
        invalid = checkIfAnswersAreEmpty()
        if (invalid) {
            errorText = document.createTextNode('There is at least one answer that is empty.');
        }

        if(!invalid) {
            // checking if at least two answers are selected as correct
            if (getAmountOfCorrectAnswers() < 2) {
                errorText = document.createTextNode('You have to select at least two answers that can be correct');
                invalid = true;
            }
        }

    }

    if (invalid) {
        if (errorText) {
            error.classList.add('error');
            error.appendChild(errorText);
        }
        document.getElementById('content').appendChild(error);
    }
    global.timoutID = setTimeout(() => {
        document.getElementById('content').removeChild(error);
        if (type === 'open question') {
            let textAreas = document.getElementsByTagName('textarea');
            textAreas[0].style.border = '';
            textAreas[1].style.border = '';
        }
    }, 2000);
    return !invalid;
}

const generateTitleOption = questionsObject => {

    let div = document.getElementById('content');

    //setting up nodes
    let h2 = document.createElement('h2');
    let h2Text = document.createTextNode('Enter the title of your quiz');
    let textField = document.createElement('input');
    let button = document.createElement('button');
    let buttonText = document.createTextNode('Save quiz');
    let br = document.createElement('br');

    textField.setAttribute('type', 'text');

    //adding eventhandlers
    button.addEventListener('click', () => {
        //storing the created quiz
        let quizObject = { questions: questionsObject }
        quizObject.title = textField.value;
        global.QUIZES.push(quizObject);
        if(JSON.parse(localStorage.getItem('quizes')).length > 0) {
            let storage = JSON.parse(localStorage.getItem('quizes')).push(quizObject);
            localStorage.setItem('quizes', JSON.stringify(storage));
        } else {
            localStorage.setItem('quizes', JSON.stringify([quizObject]));
        }
        location.href = '../../Quiz_game/loadQuiz.html';
    });

    //appending nodes
    h2.appendChild(h2Text);
    button.appendChild(buttonText);

    div.appendChild(h2);
    div.appendChild(br);
    div.appendChild(textField);
    div.appendChild(button);

    return textField.value;
}

const createQuestion = (type) => {
    let questionObject = {};
    questionObject.question = document.getElementsByTagName('textarea')[0].value;
    if(type === 'open question') {
        questionObject.answer = document.getElementsByTagName('textarea')[1].value;
    } else {
        let answers = document.getElementsByClassName('answer');
        let answersArray = [];
        for(let answer of answers) {
            if(answer.classList.contains('correct')) {
                answersArray.push({answer: answer.children[1].value, correct: true})
            } else {
                answersArray.push({answer: answer.children[1].value, correct: false})
            }
        }
        questionObject.answer = answersArray;
    }
    return questionObject;
}
window.addEventListener("load", setup);