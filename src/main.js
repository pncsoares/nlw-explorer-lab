import './css/index.css';

/**
 * 1. Select class with name cc-bg
 * 2. Select svg
 * 3. Select first level g element
 * 4. Select first child g element
 * 5. Select its path
 */
const cardBackgroundColor01 = document.querySelector(
    '.cc-bg svg > g g:nth-child(1) path'
);

const cardBackgroundColor02 = document.querySelector(
    '.cc-bg svg > g g:nth-child(2) path'
);

const cardLogo = document.querySelector('.cc-logo span:nth-child(2) img');

const colors = {
    visa: ['#436D99', '#2D57F2'],
    mastercard: ['#DF6F29', '#C69347'],
    default: ['black', 'gray'],
};

function setCardType(type) {
    cardBackgroundColor01.setAttribute('fill', colors[type][0]);
    cardBackgroundColor02.setAttribute('fill', colors[type][1]);
    cardLogo.setAttribute('src', `cc-${type}.svg`);
}
