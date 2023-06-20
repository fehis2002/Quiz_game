const global = {
    amountOfQuestions: 0,
    timoutID: 0
}

const setup = () => {
    displayTypeOfQuestions();
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


function generateQuestionSetting() {
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

function displaySubmitButtonSetting(type, div) {
    //submit question
    let button = document.createElement('button');
    let buttonText = document.createTextNode('Next Question');
    button.addEventListener('click', () => {
        clearTimeout(global.timoutID);
        if (validate(type)) {
            global.amountOfQuestions++;
            div.innerHTML = '';
            displayTypeOfQuestions();
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
        let answers = document.querySelectorAll('div#content > div > input');
        let i = 0;
        // checking if answers are empty
        while (!invalid && i < answers.length) {
            if (answers[i].value === '') {
                invalid = true;
            }
            i++;
        }
        if (invalid) {
            errorText = document.createTextNode('There is at least one answer that is empty.');
        }

        if(!invalid) {
            // checking if one answer is selected as correct
            let answerContainers = document.querySelectorAll('div#content > div');
            i = 0;
            let count = 0;
            while (count <= 1 && i < answerContainers.length) {
                if (answerContainers[i].classList.contains('correct')) {
                    count++;
                }
                i++
            }

            if (count !== 1) {
                errorText = document.createTextNode('You have to select one answer that can be correct');
            }
        }
    } else if (!invalid && type === 'question with multiple answers') {
        let answers = document.querySelectorAll('div#content > div > input');
        let i = 0;
        // checking if answers are empty
        while (!invalid && i < answers.length) {
            if (answers[i].value === '') {
                invalid = true;
            }
            i++;
        }
        if (invalid) {
            errorText = document.createTextNode('There is at least one answer that is empty.');
        }

        if(!invalid) {
            // checking if at least two answers are selected as correct
            let answerContainers = document.querySelectorAll('div#content > div');
            let count = 0;
            for(let i = 0; i < answerContainers.length; i++) {
                if (answerContainers[i].classList.contains('correct')) {
                    count++;
                }
            }
            if (count < 2) {
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
window.addEventListener("load", setup);