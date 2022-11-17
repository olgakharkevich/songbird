const scoreEl = document.querySelector('.score span');

const renderScore = (score) => {
    scoreEl.textContent = score;
};

export default renderScore;
