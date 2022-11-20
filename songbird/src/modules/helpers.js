const getRandomNum = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const format = (unit) => (unit < 10 ? `0${unit}` : `${unit}`);

const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = Math.round(s % 60);
    return `${format(min)}:${format(sec)}`;
};

export { getRandomNum, formatTime };
