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

import win from '../../assets/audio/win.mp3';
import lose from '../../assets/audio/lose.mp3';

const soundWin = new Audio(win);
const soundLose = new Audio(lose);

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

const groupItems = document.querySelectorAll('.quiz .group__item');

const playBtn = document.querySelector('.random-item .play');
const progressEl = document.querySelector('.random-item .progress');
const progressContainerEl = document.querySelector(
    '.random-item .progress-container'
);
const progressCircleEl = document.querySelector(
    '.random-item .progress-circle'
);
const curTimeEl = document.querySelector('.random-item .cur-time');
const durTimeEl = document.querySelector('.random-item .dur-time');

const activatePlayBtn = () => {
    playBtn.classList.remove('pause-image');
    playBtn.classList.add('play-image');
};

const activatePauseBtn = () => {
    playBtn.classList.remove('play-image');
    playBtn.classList.add('pause-image');
};

const playAudio = (audio) => {
    audio.play();
    state.isCurPlay = true;
    activatePauseBtn();
};

const pauseAudio = (audio) => {
    audio.pause();
    state.isCurPlay = false;
    activatePlayBtn();
};

const updateProgress = (event) => {
    const { duration, currentTime } = event.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progressEl.style.width = `${progressPercent}%`;
    progressCircleEl.style.left = `${progressPercent}%`;
    curTimeEl.textContent = formatTime(currentTime);
};

playBtn.addEventListener('click', () => {
    if (!state.isCurPlay) {
        playAudio(state.audioCur);
    } else {
        pauseAudio(state.audioCur);
    }
});

const setProgress = (event) => {
    const width = progressContainerEl.clientWidth;
    const clickX = event.offsetX;
    const { duration } = state.audioCur;
    durTimeEl.textContent = formatTime(duration);
    state.audioCur.currentTime = (clickX / width) * duration;
};

// TODO: remove duplicate code
const createCurAudio = (audioSrc) => {
    if (!state.audioCur) {
        state.audioCur = new Audio(audioSrc);
    } else {
        state.audioCur.src = audioSrc;
    }

    state.audioCur.addEventListener('loadeddata', () => {
        const durationCur = state.audioCur.duration;
        durTimeEl.textContent = formatTime(durationCur);
    });

    state.audioCur.addEventListener('timeupdate', updateProgress);
    progressContainerEl.addEventListener('click', setProgress);
};

const createAnswerAudio = (audioSrc, section) => {
    const playBtnAnswer = document.querySelector(`.${section} .play`);
    const progressAnswerEl = document.querySelector(`.${section} .progress`);
    const progressContainerAnswerEl = document.querySelector(
        `.${section} .progress-container`
    );
    const progressCircleAnswerEl = document.querySelector(
        `.${section} .progress-circle`
    );
    const curTimeAnswerEl = document.querySelector(`.${section} .cur-time`);
    const durTimeAnswerEl = document.querySelector(`.${section} .dur-time`);

    const playAudioAnswer = (audio) => {
        audio.play();
        state.isAnswerPlay = true;
        playBtnAnswer.classList.remove('play-image');
        playBtnAnswer.classList.add('pause-image');
    };

    const pauseAudioAnswer = (audio) => {
        audio.pause();
        state.isAnswerPlay = false;
        playBtnAnswer.classList.remove('pause-image');
        playBtnAnswer.classList.add('play-image');
    };

    const updateProgressAnswer = (event) => {
        const { duration, currentTime } = event.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progressAnswerEl.style.width = `${progressPercent}%`;
        progressCircleAnswerEl.style.left = `${progressPercent}%`;
        curTimeAnswerEl.textContent = formatTime(currentTime);
    };

    if (!state.audioAnswer) {
        state.audioAnswer = new Audio(audioSrc);
    } else {
        state.audioAnswer.src = audioSrc;
    }

    state.audioAnswer.addEventListener('loadeddata', () => {
        const durationCur = state.audioAnswer.duration;
        durTimeAnswerEl.textContent = formatTime(durationCur);
    });

    playBtnAnswer.addEventListener('click', () => {
        if (!state.isAnswerPlay) {
            playAudioAnswer(state.audioAnswer);
        } else {
            pauseAudioAnswer(state.audioAnswer);
        }
    });

    state.audioAnswer.addEventListener('timeupdate', updateProgressAnswer);

    const setProgressAnswer = (event) => {
        const width = progressContainerAnswerEl.clientWidth;
        const clickX = event.offsetX;
        const { duration } = state.audioAnswer;
        durTimeAnswerEl.textContent = formatTime(duration);
        state.audioAnswer.currentTime = (clickX / width) * duration;
    };

    progressContainerAnswerEl.addEventListener('click', setProgressAnswer);
};

const answerEl = document.querySelector('.answer .items');

const renderAnswers = (dataObj, groupNum) => {
    answerEl.innerHTML = '';
    dataObj[groupNum].forEach((item) => {
        answerEl.innerHTML += `<div class="items__title bg"><span></span>${item.name}</div>`;
    });
};

createCurAudio(state.curItem.audio);

renderAnswers(dataRu, state.curGroupNum);
renderScore(state.score);
renderStub();

const clearState = () => {
    state.curItem = {};
    state.isRightAnswerDone = false;
    state.audioCur.pause();
    state.isCurPlay = false;
    state.audioCur.currentTime = 0;
    state.audioCur = null;
    state.isAnswerPlay = false;
    state.audioAnswer.pause();
    state.audioAnswer = null;
    activatePlayBtn();
};

const btnNextLevel = document.querySelector('.btn .next-level');

const activateNextLevelBtn = () => {
    btnNextLevel.classList.add('active');
};

const disableBtn = () => {
    btnNextLevel.classList.remove('active');
};

btnNextLevel.addEventListener('click', () => {
    if (state.curGroupNum === 5) {
        localStorage.setItem('scoreOKh', state.score);
        window.location.href = './results.html';
        return;
    }
    disableBtn();
    clearState();
    state.curGroupNum += 1;
    state.curItem = dataRu[state.curGroupNum][getRandomNum(0, 5)];
    createCurAudio(state.curItem.audio, 'random-item');
    renderAnswers(dataRu, state.curGroupNum);
    renderStub();
    groupItems.forEach((item) => {
        item.classList.remove('active');
    });
    groupItems[state.curGroupNum].classList.add('active');
});

let curGroupScore = 5;

answerEl.addEventListener('click', (event) => {
    const answerItemEl = event.target.closest('div');
    const answerItem = dataRu[state.curGroupNum].find(
        (el) => el.name === answerItemEl.textContent
    );
    renderItem(answerItem);
    state.isAnswerPlay = false;
    createAnswerAudio(answerItem.audio, 'answer');

    if (!state.isRightAnswerDone) {
        if (state.curItem.name === answerItemEl.textContent) {
            renderRightAnswer(state.curItem);
            activateNextLevelBtn();
            state.audioCur.pause();
            state.audioCur.currentTime = 0;
            state.isCurPlay = false;
            activatePlayBtn();
            answerItemEl.classList.add('right');
            soundWin.play();
            state.isRightAnswerDone = true;
            state.score += curGroupScore;
            renderScore(state.score);
            curGroupScore = 5;
        } else {
            answerItemEl.classList.add('error');
            soundLose.play();
            curGroupScore -= 1;
        }
    }
});
