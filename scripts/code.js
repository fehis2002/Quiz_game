const setup = () => {

    let createButton = document.getElementById('create');
    let loadButton = document.getElementById('load');

    //redirects to page where we can create a quiz
    createButton.addEventListener('click', () => {
        window.location.href = '../../Quiz_game/createQuiz.html';
    })

    //redirects to page where we can load quiz's
    loadButton.addEventListener('click', () => {
        window.location.href = '../../Quiz_game/loadQuiz.html';
    })
}

window.addEventListener("load", setup);