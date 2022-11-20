// TODO: remove disable no-console
/* eslint-disable no-console */
import '../../scss/style.scss';

// import birdsDataEn from '../../data/dataEn';
import dataRu from '../../data/dataRu';

import renderScore from '../../modules/renderScore';
import { renderItem, renderStub } from '../../modules/renderStubAndItem';
import { formatTime, getRandomNum } from '../../modules/helpers';

// console.log(dataRu);

const state = {
    curGroupNum: 0,
    score: 0,
    curItem: {},
    isRightAnswerDone: false,
};

state.curItem = dataRu[state.curGroupNum][getRandomNum(0, 5)];

let isPlay = false;

const createAndRenderAudio = (audioSrc, section) => {
    const playBtn = document.querySelector(`.${section} .play`);
    const progressEl = document.querySelector(`.${section} .progress`);
    const progressContainerEl = document.querySelector(
        `.${section} .progress-container`
    );
    const progressCircleEl = document.querySelector(
        `.${section} .progress-circle`
    );
    const curTimeEl = document.querySelector(`.${section} .cur-time`);
    const durTimeEl = document.querySelector(`.${section} .dur-time`);

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

    const updateProgress = (event) => {
        const { duration, currentTime } = event.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progressEl.style.width = `${progressPercent}%`;
        progressCircleEl.style.left = `${progressPercent}%`;
        curTimeEl.textContent = formatTime(currentTime);
    };

    const audioCur = new Audio(audioSrc);

    audioCur.addEventListener('loadeddata', () => {
        const durationCur = audioCur.duration;
        durTimeEl.textContent = formatTime(durationCur);
    });

    playBtn.addEventListener('click', () => {
        if (!isPlay) {
            playAudio(audioCur);
        } else {
            pauseAudio(audioCur);
        }
    });

    audioCur.addEventListener('timeupdate', updateProgress);

    const setProgress = (event) => {
        const width = progressContainerEl.clientWidth;
        const clickX = event.offsetX;
        const { duration } = audioCur;
        durTimeEl.textContent = formatTime(duration);
        audioCur.currentTime = (clickX / width) * duration;
    };

    progressContainerEl.addEventListener('click', setProgress);
};

const answerEl = document.querySelector('.answer .items');

const renderAnswers = (dataObj, groupNum) => {
    answerEl.innerHTML = '';
    dataObj[groupNum].forEach((item) => {
        answerEl.innerHTML += `<div class="items__title bg"><span></span>${item.name}</div>`;
    });
};

createAndRenderAudio(state.curItem.audio, 'random-item');

renderAnswers(dataRu, state.curGroupNum);
renderScore(state.score);
renderStub();

let curGroupScore = 5;

answerEl.addEventListener('click', (event) => {
    const answerItemEl = event.target.closest('div');
    const answerItem = dataRu[state.curGroupNum].find(
        (el) => el.name === answerItemEl.textContent
    );
    renderItem(answerItem);
    createAndRenderAudio(answerItem.audio, 'answer');

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
