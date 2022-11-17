// TODO: remove disable no-console
/* eslint-disable no-console */
import '../../scss/style.scss';

// import birdsDataEn from '../../data/dataEn';
import dataRu from '../../data/dataRu';

import renderScore from '../../modules/renderScore';
import { renderItem, renderStub } from '../../modules/renderStubAndItem';

console.log(dataRu);

const state = {
    curGroupNum: 0,
    score: 0,
    curItem: {},
    isRightAnswerDone: false,
};

const answerEl = document.querySelector('.answer .items');

const renderAnswers = (dataObj, groupNum) => {
    answerEl.innerHTML = '';
    dataObj[groupNum].forEach((item) => {
        answerEl.innerHTML += `<div class="items__title bg"><span></span>${item.name}</div>`;
    });
};

renderAnswers(dataRu, state.curGroupNum);
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
