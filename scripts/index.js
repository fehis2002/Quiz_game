const global = {

    TYPES_OF_QUESTIONS: new Map([
        ['open', 'Open questions'],
        ['openi', 'Open questions (number)'],
        ['mc', 'Multiple choice'],
        ['mci', 'Multiple choice (pictures)']
    ]),

    DESCRIPTIONS: new Map([
        ['open', 'This is an open question. The only answers that are allowed are non-integer answers. ' +
        'An open answer with text and numbers are allowed, but strictly integers are not allowed.'],
        ['openi', 'This is an open question where integers are the only valid answers'],
        ['mc', 'This is an multiple choice question.'],
        ['mci', 'This is an multiple choice question where images are answers.']
    ]),

    QUIZ: {
        title: '',
        questions: []
    }

}

const setup = () => {

    let createButton = document.getElementById('create');

    createButton.addEventListener('click', () => {

        //clearing the page
        document.getElementById('content').innerHTML = '';
        createQuiz();

    });

    if(localStorage.getItem('quizes') === null) {
        localStorage.setItem('quizes', JSON.stringify([]));
    }

}

/**
 * Displays the pages that are necessary to create a quiz
 */
const createQuiz = () => {

    let div = document.getElementById('content');

    //making title
    let title = document.createElement('h1');
    title.appendChild(document.createTextNode('Choose the type of question'));

    //appending title to page
    div.appendChild(title);

    //making buttons
    for(let type of global.TYPES_OF_QUESTIONS) {
        let button = document.createElement('button');
        button.appendChild(document.createTextNode(`${type[1]}`));

        button.addEventListener('click', () => {
            //clear page
            document.getElementById('content').innerHTML = '';

            //constructing the page
            displayHeader(type[1], global.DESCRIPTIONS.get(type[0]));
            displayQuestion();
            displayImageOption();
            displayAnswers(type[0]);
            displayFooter(type[0]);
        });
        //appending button to page
        div.appendChild(button);
    }
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
 * Displays the option to add images to an question
 */
const displayImageOption = () => {

    let div = document.getElementById('content');

    //making nodes
    let file = document.createElement('input');
    let h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode('Image (optional)'));

    //setting attributes
    file.setAttribute('type', 'file');
    file.setAttribute('id', 'image');

    div.appendChild(h2);
    div.appendChild(file);
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
                } else if (type === 'mci') {
                    answer = document.createElement('input');
                    answer.setAttribute('type', 'file');
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

    let div = document.getElementById('content');

    //making nodes
    let next = document.createElement('button');
    let cancel = document.createElement('button');
    let save = document.createElement('button');
    next.appendChild(document.createTextNode('next question'));
    cancel.appendChild(document.createTextNode('cancel'));
    save.appendChild(document.createTextNode('save quiz'));

    //adding eventhandlers
    next.addEventListener('click', () => {
        //removing the error message
        let errormessage = document.getElementById('error');
        if(errormessage !== null) {
            div.removeChild(errormessage);
        }

        if(validate(type)) {
            //store question
            storeQuestion(type)
            div.innerHTML = '';
            createQuiz();
        }
    });

    cancel.addEventListener('click', () => {
        div.innerHTML = '';
        createQuiz();
    });

    save.addEventListener('click', () => {
        if(validate(type)) {
            //store question
            storeQuestion(type)
            div.innerHTML = '';
            displayTitleOption();
        }
    })

    //appending nodes
    div.appendChild(cancel);
    div.appendChild(next);
    div.appendChild(save);
}

/**
 * Validates question for a given type of question
 * @param type
 */
const validate = type => {

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
    } else if (valid && (type === 'mc'  || type === 'mci')) {
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
    let imageValue = document.getElementById('image').value;
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
        image: imageValue,
        answers: answersValue
    })
}

/**
 * Displays a page where the title of a quiz can be inserted
 */
const displayTitleOption = () => {

    let div = document.getElementById('content');

    //making nodes
    let h1 = document.createElement('h1');
    let textfield = document.createElement('input');
    let button = document.createElement('button');

    //setting attributes
    textfield.setAttribute('type', 'text');

    //adding eventhandler
    button.addEventListener('click', () => {
        //change title of quiz
        global.QUIZ.title = textfield.value;

        //update localstorage
        let quizes = JSON.parse(localStorage.getItem('quizes'));
        quizes.push(global.QUIZ);
        localStorage.setItem('quizes', JSON.stringify(quizes));

        div.innerHTML = '';

    });

    //appending nodes
    button.appendChild(document.createTextNode('Save quiz'));
    h1.appendChild(document.createTextNode('Enter a title'));
    div.appendChild(h1);
    div.appendChild(textfield);
    div.appendChild(document.createElement('br'));
    div.appendChild(button);


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
}
window.addEventListener("load", setup);