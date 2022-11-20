// TODO: remove disable no-console
/* eslint-disable no-console */
import '../../scss/style.scss';

// import birdsDataEn from '../../data/dataEn';
import dataRu from '../../data/dataRu';

import renderScore from '../../modules/renderScore';
import { renderItem, renderStub } from '../../modules/renderStubAndItem';
import { formatTime } from '../../modules/helpers';

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

const audioSrc = dataRu[0][0].audio;
const audioCur = new Audio(audioSrc);

const playBtn = document.getElementById('play');
const progressEl = document.getElementById('progress');
const progressContainerEl = document.getElementById('progress-container');
const progressCircleEl = document.getElementById('progress-circle');
const curTimeEl = document.getElementById('cur-time');
const durTimeEl = document.getElementById('dur-time');

// TODO: move to function renderAudio;
audioCur.addEventListener('loadeddata', () => {
    const durationCur = audioCur.duration;
    durTimeEl.textContent = formatTime(durationCur);
});

let isPlay = false;

const playAudio = (audio) => {
    audio.play();
    isPlay = true;
    playBtn.classList.remove('play-image');
    playBtn.classList.add('pause-image');
};

const pauseAudio = (audio) => {
    audio.pause();
    isPlay = false;
    playBtn.classList.remove('pause-image');
    playBtn.classList.add('play-image');
};

playBtn.addEventListener('click', () => {
    if (!isPlay) {
        playAudio(audioCur);
    } else {
        pauseAudio(audioCur);
    }
});

const updateProgress = (event) => {
    const { duration, currentTime } = event.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progressEl.style.width = `${progressPercent}%`;
    progressCircleEl.style.left = `${progressPercent}%`;
    curTimeEl.textContent = formatTime(currentTime);
};

audioCur.addEventListener('timeupdate', updateProgress);

const setProgress = (event) => {
    const width = progressContainerEl.clientWidth;
    const clickX = event.offsetX;
    const { duration } = audioCur;
    console.log(duration);
    durTimeEl.textContent = formatTime(duration);
    audioCur.currentTime = (clickX / width) * duration;
};

progressContainerEl.addEventListener('click', setProgress);

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
