const setup = () => {

    let createButton = document.getElementById('create');
    let loadButton = document.getElementById('load');

    //redirects to page where we can create a quiz
    createButton.addEventListener('click', () => {
        location.href = '../createQuiz.html';
    })

    //redirects to page where we can load quizes
    loadButton.addEventListener('click', () => {
        location.href = '../loadQuiz.html';
    })
}

window.addEventListener("load", setup);