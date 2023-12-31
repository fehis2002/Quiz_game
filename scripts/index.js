const global = {

    TYPES_OF_QUESTIONS: new Map([
        ['open', 'Open questions'],
        ['openi', 'Open questions (number)'],
        ['mc', 'Multiple choice'],
    ]),

    DESCRIPTIONS: new Map([
        ['open', 'This is an open question. The only answers that are allowed are non-integer answers. ' +
        'An open answer with text and numbers are allowed, but strictly integers are not allowed.'],
        ['openi', 'This is an open question where integers are the only valid answers'],
        ['mc', 'This is an multiple choice question.'],
    ]),

    QUIZ: {
        title: '',
        questions: []
    },

    currentQuiz: [],

    questionPointer: 0,

    currentErrorMessageNode: '',

    score: 0

}

const setup = () => {

    displayHomePage();
    if(localStorage.getItem('quizes') === null) {
        localStorage.setItem('quizes', JSON.stringify([]));
    }

}

/**
 * Displays homepage of the quiz app
 */
const displayHomePage = () => {

    //creating nodes
    let content = document.getElementById('content')
    let title = document.createElement('h1');
    let text = document.createElement('p');
    let buttonDiv = document.createElement('div');
    let create = document.createElement('button');
    let load = document.createElement('button');

    //clear page
    content.innerHTML = '';

    //appending nodes
    title.appendChild(document.createTextNode('Quiz game'));
    text.appendChild(document.createTextNode('' +
        'If you haven\'t created a quiz, click on the "Create a quiz game" button. If you have created a quiz, ' +
        'then you can load a quiz game by clicking the "Load a quiz game" button.'
    ));
    create.appendChild(document.createTextNode('Create a quiz game'));
    load.appendChild(document.createTextNode('Load a quiz game'));
    buttonDiv.appendChild(create);
    buttonDiv.appendChild(load);
    content.appendChild(title);
    content.appendChild(text);
    content.appendChild(buttonDiv);

    //setting id's
    buttonDiv.setAttribute('id', 'mainButtonsDiv')
    create.setAttribute('id', 'create');
    load.setAttribute('id', 'load');

    let createButton = document.getElementById('create');
    let loadButton = document.getElementById('load');

    createButton.addEventListener('click', () => {

        //clearing the page
        content.innerHTML = '';
        createQuiz();

    });

    loadButton.addEventListener('click', () => {
        //clearing the page
        content.innerHTML = '';
        loadQuizes();
    });
}

/**
 * Displays the pages that are necessary to create a quiz
 */
const createQuiz = () => {

    let content = document.getElementById('content');

    //making nodes
    let title = document.createElement('h1');
    let buttonsDiv = document.createElement('div');
    let questionsButtonsDiv = document.createElement('div');
    let goBackButton = document.createElement('button');
    let saveQuiz = document.createElement('button');

    //appending nodes
    title.appendChild(document.createTextNode('Choose the type of question'));
    goBackButton.appendChild(document.createTextNode('Go back'));
    saveQuiz.appendChild(document.createTextNode('Save quiz'));
    buttonsDiv.appendChild(goBackButton);
    buttonsDiv.appendChild(saveQuiz);
    content.appendChild(title);

    //making buttons
    for(let type of global.TYPES_OF_QUESTIONS) {
        let button = document.createElement('button');
        button.appendChild(document.createTextNode(`${type[1]}`));

        button.addEventListener('click', () => {
            //remove potential error messages that appear in the page where you can choose the type of question that
            //can create
            global.currentErrorMessageNode = '';

            //clear page
            content.innerHTML = '';

            //constructing the page
            displayHeader(type[1], global.DESCRIPTIONS.get(type[0]));
            displayQuestion();
            displayAnswers(type[0]);
            displayFooter(type[0]);
        });
        //appending button to div
        questionsButtonsDiv.appendChild(button);
    }

    //appending buttons to page
    content.appendChild(questionsButtonsDiv);
    content.appendChild(buttonsDiv);

    //setting id's
    questionsButtonsDiv.setAttribute('id', 'questionButtonsDiv');
    buttonsDiv.setAttribute('id', 'mainButtonsDiv');

    //adding eventlisteners to buttons
    goBackButton.addEventListener('click', () => {
        //remove error messages that have possibly appeared
        if(global.currentErrorMessageNode) {
            clearErrorMessage(global.currentErrorMessageNode);
        }
        displayHomePage();
    });
    saveQuiz.addEventListener('click', () => {
        //remove error messages that have possibly appeared
        if(global.currentErrorMessageNode) {
            clearErrorMessage(global.currentErrorMessageNode);
        }
        if(global.QUIZ.questions.length === 0) {
            displayErrorMessage("Can't save a quiz that has no questions");
        } else {
            displayTitleOption();
        }
    });
}

/**
Displays question field when creating a quiz
 */
const displayQuestion = () => {

    let div = document.getElementById('content');

    //making nodes
    let question = document.createElement('h2');
    question.appendChild(document.createTextNode('Question:'));
    let questionField = document.createElement('textarea');
    questionField.setAttribute('id', 'question');

    //appending nodes
    div.appendChild(question);
    div.appendChild(questionField);
    div.appendChild(document.createElement('br'));
}

/**
Displays a header when making a question
 */
const displayHeader = (type, description) => {

    let div = document.getElementById('content');

    //Making nodes
    let title = document.createElement('h1');
    title.appendChild(document.createTextNode(type));
    let descript = document.createElement('p');
    descript.appendChild(document.createTextNode(description));

    div.appendChild(title);
    div.appendChild(descript);
    div.appendChild(document.createElement('br'));
}



/**
 * Displays answers options for a given type of question
 * @param type
 */
const displayAnswers = type => {

    let div = document.getElementById('content');

    let answerTitle = document.createElement('h2');
    answerTitle.appendChild(document.createTextNode('Answer:'));
    div.appendChild(answerTitle);

    if(type === 'open') {
        let textArea = document.createElement('textarea');
        textArea.classList.add('answers');
        div.appendChild(textArea);
    } else if (type === 'openi') {
        let textField = document.createElement('input');
        textField.setAttribute('type' , 'text');
        textField.classList.add('answers')
        div.appendChild(textField);
    } else {
            for (let i = 0; i < 3; i++) {
                //making nodes
                let container = document.createElement('div');
                let check = document.createElement('button');
                let cancel = document.createElement('button');
                check.appendChild(document.createTextNode('check'));
                cancel.appendChild(document.createTextNode('cancel'));
                let answer;
                if (type === 'mc') {
                    answer = document.createElement('textarea');
                }
                //adding eventhandlers
                check.addEventListener('click', () => {
                    container.classList.add('correct');
                    check.setAttribute('disabled', 'true');
                    cancel.removeAttribute('disabled');
                });
                cancel.addEventListener('click', () => {
                    container.classList.remove('correct');
                    check.removeAttribute('disabled');
                    cancel.setAttribute('disabled', 'true');
                })
                //adding styles, classes, attributes,...
                container.classList.add('answers');
                cancel.setAttribute('disabled', 'true');
                //appending nodes
                container.appendChild(check);
                container.appendChild(answer);
                container.appendChild(cancel);

                //setting classes for styles
                container.classList.add('mcContainer');

                div.appendChild(container);
            }
    }

    div.appendChild(document.createElement('br'));
}

/**
 * Displays the footer for a given type of question
 * @param type
 */
const displayFooter = type => {

    let content = document.getElementById('content');

    //making nodes
    let next = document.createElement('button');
    let cancel = document.createElement('button');
    let save = document.createElement('button');
    let mainButtonsDiv = document.createElement('div');
    next.appendChild(document.createTextNode('next question'));
    cancel.appendChild(document.createTextNode('cancel'));
    save.appendChild(document.createTextNode('save quiz'));

    //adding eventhandlers
    next.addEventListener('click', () => {
        if(validate(type)) {
            //store question
            storeQuestion(type)
            content.innerHTML = '';
            createQuiz();
        }
    });

    cancel.addEventListener('click', () => {
        content.innerHTML = '';
        createQuiz();
    });

    save.addEventListener('click', () => {
        if(validate(type)) {
            //store question
            storeQuestion(type)
            content.innerHTML = '';
            displayTitleOption();
        }
    })

    //setting id's
    mainButtonsDiv.setAttribute('id', 'mainButtonsDiv');

    //appending nodes
    mainButtonsDiv.appendChild(cancel);
    mainButtonsDiv.appendChild(next);
    mainButtonsDiv.appendChild(save);
    content.appendChild(mainButtonsDiv);
}

/**
 * Validates question for a given type of question
 * @param type
 */
const validate = type => {

    //Clear previous error message that appear in the page where you can create a question
    if(global.currentErrorMessageNode) {
        clearErrorMessage(global.currentErrorMessageNode);
    }


    let valid = true;
    //checking if question is empty
    let questionField = document.getElementById('question');
    if(questionField.value === '') {
        displayErrorMessage('Question field is empty');
        valid = false;
    }

    //checking if answer is  valid
    let answers = document.getElementsByClassName('answers');
    if(valid && type === 'open') {
        if (answers[0].value === '') { //checking if answer is empty
            displayErrorMessage('The answer field is empty');
            valid = false;
        } else if (Number.isInteger(Number.parseInt(answers[0].value))) { //checking if answer is an integer
            displayErrorMessage('The answer only contains an integer');
            valid = false;
        }
    } else if (valid && type === 'openi') {
        if (answers[0].value === '') { //checking if answer is empty
            displayErrorMessage('The answer field is empty');
            valid = false;
        } else if (!Number.isInteger(Number.parseInt(answers[0].value))) { //checking if answer is an integer
            displayErrorMessage('The answer isn\'t an integer');
            valid = false;
        }
    } else if (valid && type === 'mc') {
        let empty = false;
        let i = 0;
        while(!empty && i < answers.length) {
            if(answers[i].children[1].value === '') {
                empty = true;
            }
            i++;
        }

        //checking if one answer has been selected
        let count = 0;
        for(let answer of answers) {
            if(answer.classList.contains('correct')) {
                count++;
            }
        }


        if(empty) {
            displayErrorMessage('one or more of the answers are empty');
            valid = false;
        } else if (count !== 1) {
            displayErrorMessage('Only one answer can be selected as correct');
            valid = false;
        }
    }

    return valid;
}

/**
 * Stores information of a question for a given type
 * @param type
 */
const storeQuestion = type => {

    //retrieving data from a question
    let questionValue = document.getElementById('question').value;
    let typeValue = type;
    let answersValue;
    if(type === 'open' || type === 'openi') {
        answersValue = document.getElementsByClassName('answers')[0].value;
    } else {
        answersValue = [];
        for(let answer of document.getElementsByClassName('answers')) {
            if(answer.classList.contains('correct')) {
                answersValue.push([answer.children[1].value, true]);
            } else {
                answersValue.push([answer.children[1].value, false]);
            }
        }
    }

    //store question
    global.QUIZ.questions.push({
        type: typeValue,
        question: questionValue,
        answers: answersValue
    })
}

/**
 * Displays a page where the title of a quiz can be inserted
 */
const displayTitleOption = () => {

    let content = document.getElementById('content');

    //clear page
    content.innerHTML = '';

    //making nodes
    let h1 = document.createElement('h1');
    let textfield = document.createElement('input');
    let save = document.createElement('button');
    let goBack = document.createElement('button');

    //setting attributes
    textfield.setAttribute('type', 'text');

    //adding eventhandler
    save.addEventListener('click', () => {
        //removing possible error message from page
        if(global.currentErrorMessageNode) {
            clearErrorMessage(global.currentErrorMessageNode);
        }

        if(textfield.value) {
            //change title of quiz
            global.QUIZ.title = textfield.value;

            //update localstorage
            let quizes = JSON.parse(localStorage.getItem('quizes'));
            quizes.push(global.QUIZ);
            localStorage.setItem('quizes', JSON.stringify(quizes));

            //clear page
            content.innerHTML = '';

            //return to homepage
            displayHomePage();

            //clearing quiz object
            global.QUIZ = {};
        } else {
            displayErrorMessage("You can't save a quiz that has no title");
        }
    });

    goBack.addEventListener('click', () => {
        //clear page
        content.innerHTML = '';
        createQuiz();
    });

    //appending nodes
    save.appendChild(document.createTextNode('Save quiz'));
    goBack.appendChild(document.createTextNode('Go back'));
    h1.appendChild(document.createTextNode('Enter a title'));
    content.appendChild(h1);
    content.appendChild(textfield);
    content.appendChild(document.createElement('br'));
    content.appendChild(save);
    content.appendChild(goBack);


}

/**
 * Displays an error message when creating when a question
 * @param message
 */
const displayErrorMessage = message => {

    //making nodes
    let div = document.getElementById('content');
    let p = document.createElement('p');

    //adding attributes
    p.setAttribute('id', 'error');

    //appending nodes
    p.appendChild(document.createTextNode(`${message}`));
    div.appendChild(p);

    global.currentErrorMessageNode = p;
}

/**
 * Removes a question that has been displayed
 * @param errorMessageNode
 */
const clearErrorMessage = errorMessageNode => {

    //making nodes
    let content = document.getElementById('content');

    if(errorMessageNode) {
        content.removeChild(errorMessageNode);
    }

    global.currentErrorMessageNode = '';
}

const loadQuizes = () => {

    let content = document.getElementById('content');

    //making nodes
    let h1 = document.createElement('h1');
    let loadContent = document.createElement('div');

    //adding classes
    loadContent.setAttribute('id', 'loadContent');

    //appending nodes
    h1.appendChild(document.createTextNode('Quizes'));
    content.appendChild(h1);
    content.append(loadContent);

    //displaying saved quizes
    for(let quiz of (JSON.parse(localStorage.getItem('quizes')))) {
        let quizDiv = document.createElement('div');
        let h2 = document.createElement('h2');

        //adding styles
        quizDiv.classList.add('quizDiv');

        //eventListeners
        quizDiv.addEventListener('click', () => {
            // clear page
            content.innerHTML ='';
            global.currentQuiz = quiz.questions;
            generateQuestion(global.currentQuiz[global.questionPointer]);


        });

        //appending nodes
        h2.appendChild(document.createTextNode(quiz.title));
        quizDiv.appendChild(h2);
        loadContent.appendChild(quizDiv);
    }
}

/**
 * Generates question for a given question data format
 * @param question data
 */
const generateQuestion = question => {

    let content = document.getElementById('content');
    //creating nodes
    let p = document.createElement('p');
    let submitButton = document.createElement('button');
    let repButtonsDiv = document.createElement('div');

    //appending nodes
    p.appendChild(document.createTextNode(question.question));
    submitButton.appendChild(document.createTextNode('Sumbit answer'))
    content.appendChild(p);

    //setting id's
    repButtonsDiv.setAttribute('id', 'repButtonsDiv');
    p.setAttribute('id', 'repQuestion');


    //making nodes for each question type
    if(question.type === 'open') {
        let textarea = document.createElement('textarea');
        content.appendChild(textarea);
        textarea.setAttribute('id', 'repAnswer')
    } else if (question.type === 'openi') {
        let textField = document.createElement('input');
        textField.setAttribute('type', 'text');
        content.appendChild(textField);
        textField.setAttribute('id', 'repAnswer')
    } else {
        for(let answer of question.answers) {
            let button = document.createElement('button');
            if (question.type === 'mc') {
                button.appendChild(document.createTextNode(answer[0]));
                repButtonsDiv.appendChild(button);
            }
            button.addEventListener('click', () => {
                //checking if a button is that has been clicked is the correct answer
                if(answer[1]) {
                    increaseScore();
                }
                goToNextQuestion();
            });
            content.appendChild(repButtonsDiv);
        }
    }

    if(question.type === 'open' || question.type === 'openi') {
        submitButton.addEventListener('click', () => {
            //checking if a given answer equals the correct answer
            if(question.answers === content.children[1].value) {
                increaseScore();
            }
            goToNextQuestion();
        });
        repButtonsDiv.appendChild(submitButton);
        content.appendChild(repButtonsDiv);
    }
}

/**
 * Skips to next question
 */
const goToNextQuestion = () => {

    let content = document.getElementById('content');
    //clear page
    content.innerHTML = '';
    //going to the next question
    global.questionPointer++;
    if(global.questionPointer === global.currentQuiz.length) {
        displayEndQuizPage();
    }
    generateQuestion(global.currentQuiz[global.questionPointer]);
}

/**
 * Displaying the page of the end of a quiz
 */
const displayEndQuizPage = () => {
    //clear page
    let content = document.getElementById('content');
    content.innerHTML = '';
    //making nodes
    let h1 = document.createElement('h1');
    let button = document.createElement('button');
    let p = document.createElement('p');
    let repButtonsDiv = document.createElement('div');
    //appending nodes
    h1.appendChild(document.createTextNode('Quiz has ended'));
    button.appendChild(document.createTextNode('Go to Homepage'));
    p.appendChild(document.createTextNode(`You've scored ${Math.round(global.score / global.currentQuiz.length * 100)}%`))
    repButtonsDiv.appendChild(button);
    content.appendChild(h1);
    content.appendChild(p);
    content.appendChild(repButtonsDiv);

    //setting id's
    repButtonsDiv.setAttribute('id', 'repButtonsDiv');

    //adding eventhandlers
    button.addEventListener('click', () => {
        displayHomePage();
        //reset question pointer and score
        global.questionPointer = 0;
        global.score = 0;
    });

}

/**
 * Increases score of a quiz
 */
const increaseScore = () => {
    global.score++;
}
window.addEventListener("load", setup);