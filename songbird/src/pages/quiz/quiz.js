// TODO: remove disable no-console
/* eslint-disable no-console */
import '../../scss/style.scss';

// import birdsDataEn from '../../data/dataEn';
import dataRu from '../../data/dataRu';

import renderScore from '../../modules/renderScore';
import {
    renderItem,
    renderRightAnswer,
    renderStub,
} from '../../modules/renderFns';
import { formatTime, getRandomNum } from '../../modules/helpers';

const state = {
    curGroupNum: 0,
    score: 0,
    curItem: {},
    isRightAnswerDone: false,
    isCurPlay: false,
    audioCur: null,
    isAnswerPlay: false,
    audioAnswer: null,
};

state.curItem = dataRu[state.curGroupNum][getRandomNum(0, 5)];

// TODO: remove duplicate code
const createCurAudio = (audioSrc, section) => {
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
        state.isCurPlay = true;
        playBtn.classList.remove('play-image');
        playBtn.classList.add('pause-image');
    };

    const pauseAudio = (audio) => {
        audio.pause();
        state.isCurPlay = false;
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

    if (!state.audioAnswer) {
        state.audioCur = new Audio(audioSrc);
    } else {
        state.audioCur.src = audioSrc;
    }

    state.audioCur.addEventListener('loadeddata', () => {
        const durationCur = state.audioCur.duration;
        durTimeEl.textContent = formatTime(durationCur);
    });

    playBtn.addEventListener('click', () => {
        if (!state.isCurPlay) {
            playAudio(state.audioCur);
        } else {
            pauseAudio(state.audioCur);
        }
    });

    state.audioCur.addEventListener('timeupdate', updateProgress);

    const setProgress = (event) => {
        const width = progressContainerEl.clientWidth;
        const clickX = event.offsetX;
        const { duration } = state.audioCur;
        durTimeEl.textContent = formatTime(duration);
        state.audioCur.currentTime = (clickX / width) * duration;
    };

    progressContainerEl.addEventListener('click', setProgress);
};

const createAnswerAudio = (audioSrc, section) => {
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
        state.isAnswerPlay = true;
        playBtn.classList.remove('play-image');
        playBtn.classList.add('pause-image');
    };

    const pauseAudio = (audio) => {
        audio.pause();
        state.isAnswerPlay = false;
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

    if (!state.audioAnswer) {
        state.audioAnswer = new Audio(audioSrc);
    } else {
        state.audioAnswer.src = audioSrc;
    }

    state.audioAnswer.addEventListener('loadeddata', () => {
        const durationCur = state.audioAnswer.duration;
        durTimeEl.textContent = formatTime(durationCur);
    });

    playBtn.addEventListener('click', () => {
        if (!state.isAnswerPlay) {
            playAudio(state.audioAnswer);
        } else {
            pauseAudio(state.audioAnswer);
        }
    });

    state.audioAnswer.addEventListener('timeupdate', updateProgress);

    const setProgress = (event) => {
        const width = progressContainerEl.clientWidth;
        const clickX = event.offsetX;
        const { duration } = state.audioAnswer;
        durTimeEl.textContent = formatTime(duration);
        state.audioAnswer.currentTime = (clickX / width) * duration;
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

createCurAudio(state.curItem.audio, 'random-item');

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

    createAnswerAudio(answerItem.audio, 'answer');

    if (!state.isRightAnswerDone) {
        if (state.curItem.name === answerItemEl.textContent) {
            renderRightAnswer(state.curItem);
            state.audioCur.pause();
            state.isCurPlay = false;
            state.audioCur.currentTime = 0;
            document
                .querySelector('.random-item .play')
                .classList.remove('pause-image');
            document
                .querySelector('.random-item .play')
                .classList.add('play-image');
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
