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

export { renderItem, renderStub };
