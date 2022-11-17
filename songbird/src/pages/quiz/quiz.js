// TODO: remove disable no-console
/* eslint-disable no-console */
import '../../scss/style.scss';

// import birdsDataEn from '../../modules/dataEn';
import dataRu from '../../modules/dataRu';
import randomItemImg from '../../assets/jpg/random-bird.jpg';

console.log(dataRu);

const state = {
    curGroupNum: 0,
    score: 0,
    curItem: {},
    isRightAnswerDone: false,
};

const answerEl = document.querySelector('.answer .items');

const renderAnswers = (groupNum) => {
    answerEl.innerHTML = '';
    dataRu[groupNum].forEach((item) => {
        answerEl.innerHTML += `<div class="items__title bg"><span></span>${item.name}</div>`;
    });
};

const scoreEl = document.querySelector('.score span');

const renderScore = (score) => {
    scoreEl.textContent = score;
};

const descriptionEl = document.querySelector('.answer .description');
const randomItemImage = document.querySelector('.random-item .image');
const randomItemTitle = document.querySelector('.random-item .title');

const renderStub = () => {
    randomItemImage.style.backgroundImage = `url(${randomItemImg})`;
    randomItemTitle.innerHTML = '*****';
    descriptionEl.innerHTML = `
        <p>Послушайте плеер. <br>
        Выберите птицу из списка</p>`;
};

const renderItem = (item) => {
    descriptionEl.innerHTML = `
    <div class="image" style="background-image: url(${item.image});"></div>
    <div class="title">
        <h3 class="title__lan">${item.name}</h3>
        <h4 class="title__lat">${item.species}</h4>
    </div>
    <div class="player"></div>
    <div class="text">${item.description}</div>`;
};

renderAnswers(state.curGroupNum);
renderScore(state.score);
renderStub();

// state.curItem = dataRu[0][0];

let curGroupScore = 5;

answerEl.addEventListener('click', (event) => {
    const answerItemEl = event.target.closest('div');
    const answerItem = dataRu[state.curGroupNum].find(
        (el) => el.name === answerItemEl.textContent
    );
    renderItem(answerItem);
    // console.log(answerItemEl);
    if (!state.isRightAnswerDone) {
        if (state.curItem.name === answerItemEl.textContent) {
            answerItemEl.classList.add('right');
            state.isRightAnswerDone = true;
            state.score += curGroupScore;
            renderScore(state.score);
            curGroupScore = 5;
        } else {
            answerItemEl.classList.add('error');
            curGroupScore -= 1;
        }
    }
});
