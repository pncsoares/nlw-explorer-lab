import IMask from 'imask';
import Toastify from 'toastify-js';

import './css/index.css';
import 'toastify-js/src/toastify.css';

const cardColors = {
    visa: ['#436D99', '#2D57F2'],
    mastercard: ['#DF6F29', '#C69347'],
    default: ['black', 'gray'],
};

function setCardType(type) {
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

    cardBackgroundColor01.setAttribute('fill', cardColors[type][0]);
    cardBackgroundColor02.setAttribute('fill', cardColors[type][1]);
    cardLogo.setAttribute('src', `cc-${type}.svg`);
}

function handleCardNumber() {
    const cardNumber = document.querySelector('#card-number');
    const cardNumberValue = document.querySelector('.cc-number');

    /**
     * VISA
     * starts with 4 and have a total of 15 numbers
     */
    const visaRegex = /^4\d{0,15}/;

    /**
     * MASTERCARD
     *  starts with 5 followed by a number between 1 and 5 followed by two more numbers followed by 12 more numbers
     *   OR
     *  starts with 22 followed by a number between 2 and 9 followed by one more number followed by 12 more numbers
     *   OR
     *  starts with 2 followed by a number between 3 and 7 followed by two more numbers followed by 12 more numbers
     */
    const mastercardRegex =
        /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/;

    const cardNumberPattern = {
        mask: [
            {
                mask: '0000 0000 0000 0000',
                regex: visaRegex,
                cardType: 'visa',
            },
            {
                mask: '0000 0000 0000 0000',
                regex: mastercardRegex,
                cardType: 'mastercard',
            },
            {
                mask: '0000 0000 0000 0000',
                cardType: 'default',
            },
        ],
        dispatch: (appended, dynamicMasked) => {
            const number = (dynamicMasked.value + appended).replace(/\D/g, '');

            return dynamicMasked.compiledMasks.find(({ regex }) => {
                return number.match(regex);
            });
        },
    };

    const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

    cardNumberMasked.on('accept', () => {
        cardNumberValue.innerText =
            cardNumberMasked.value.length > 0
                ? cardNumberMasked.value
                : '0000 0000 0000 0000';

        setCardType(cardNumberMasked.masked.currentMask.cardType);
    });
}

function handleCardholderName() {
    const cardholderName = document.querySelector('#card-holder');
    const cardholderNameValue = document.querySelector('.cc-holder .value');

    cardholderName.addEventListener('input', () => {
        cardholderNameValue.innerText =
            cardholderName.value.length > 0
                ? cardholderName.value
                : 'NAME SURNAME';
    });
}

function handleExpiry() {
    const expirationDate = document.querySelector('#expiration-date');
    const expirationDateValue = document.querySelector('.cc-expiration .value');
    
    const currentYear = new Date().getFullYear();
    const defaultExpirationDate = getDefaultExpirationDate();

    expirationDateValue.innerText = defaultExpirationDate;

    const expirationDatePattern = {
        mask: 'MM{/}YYYY',
        blocks: {
            MM: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 12,
            },
            YYYY: {
                mask: IMask.MaskedRange,
                from: currentYear,
                to: currentYear + 10,
            },
        },
    };

    const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

    expirationDateMasked.on('accept', () => {
        expirationDateValue.innerText =
        expirationDateMasked.value.length > 0
            ? expirationDateMasked.value
            : defaultExpirationDate;
    });
}

function getDefaultExpirationDate() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return `${String(currentMonth).padStart(2, '0')}/${currentYear + 10}`;
}

function handleCardSecurityCode() {
    const securityCode = document.querySelector('#security-code');
    const securityCodeValue = document.querySelector('.cc-security .value');

    const securityCodePattern = {
        mask: '000',
    };

    const securityCodeMasked = IMask(securityCode, securityCodePattern);

    securityCodeMasked.on('accept', () => {
        securityCodeValue.innerText =
            securityCodeMasked.value.length > 0
                ? securityCodeMasked.value
                : '123';
    });
}

let cardAdded = false;

function handleAddCard() {
    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    const addCardButton = document.querySelector('#add-card');

    addCardButton.addEventListener('click', () => {
        if (!cardAdded) {
            showToast('Card added successfully!');
            cardAdded = true;

            addCardButton.style.backgroundColor = '#33FF6E';
            addCardButton.innerText = 'CARD ADDED';
        }
    });
}

function showToast(message) {
    var myToast = Toastify({
        text: message,
        duration: 5000,
    });

    myToast.showToast();
}

function init() {
    handleCardNumber();
    handleCardholderName();
    handleExpiry();
    handleCardSecurityCode();
    handleAddCard();
}

init();
