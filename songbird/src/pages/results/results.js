import '../../scss/style.scss';

import renderScore from '../../modules/renderScore';

console.log('results page');

const resultEl = document.querySelector('.results .text span');
const btnNewGameEl = document.querySelector('.results .btn');
const textEl = document.querySelector('.results .text');

const score = localStorage.getItem('scoreOKh');

renderScore(score);

resultEl.textContent = score;

if (score === 30) {
    btnNewGameEl.classList.add('hidden');
    const div = document.createElement('div');
    div.textContent = 'Это максимальный результат!';
    textEl.appendChild(div);
}

btnNewGameEl.addEventListener('click', () => {
    window.location.href = './quiz.html';
});
