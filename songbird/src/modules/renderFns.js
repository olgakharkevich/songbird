import randomItemImg from '../assets/jpg/random-bird.jpg';

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

const renderRightAnswer = (item) => {
    randomItemImage.style.backgroundImage = `url(${item.image})`;
    randomItemTitle.innerHTML = item.name;
};

const renderItem = (item) => {
    descriptionEl.innerHTML = `
    <div class="image" style="background-image: url(${item.image});"></div>
    <div class="info">
        <h3 class="title__lan">${item.name}</h3>
        <h4 class="title__lat">${item.species}</h4>
        <div class="audio">
            <div class="audio__container">
                <div class="title"></div>
                <div class="player">
                    <div class="nav-progress">
                        <div class="navigation">
                          <div class="play play-image action-btn"></div>
                        </div>
                        <div class="progress-container">
                          <div class="progress"></div>
                          <div class="progress-circle"></div>
                        </div>
                    </div>
                    <div class="duration">
                        <div class="cur-time">00:00</div>
                        <div class="dur-time"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="text">${item.description}</div>`;
};

export { renderItem, renderRightAnswer, renderStub };
