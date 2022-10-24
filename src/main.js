import IMask from 'imask';
import Toastify from 'toastify-js';

import './css/index.css';
import 'toastify-js/src/toastify.css';

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const cardColors = {
    visa: ['#436D99', '#2D57F2'],
    mastercard: ['#DF6F29', '#C69347'],
    default: ['black', 'gray'],
};

const toastColors = {
    info: '#33CEFF',
    success: '#33FF6E',
    warning: '#FFE633',
    error: '#FF4233',
};

const defaultCardNumber = '0000 0000 0000 0000';
const toastDuration = 5000; // 5 seconds

const cardNumber = document.querySelector('#card-number');
const cardholderName = document.querySelector('#card-holder');
const expirationDate = document.querySelector('#expiration-date');
const securityCode = document.querySelector('#security-code');
const addCardButton = document.querySelector('#add-card');

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
                mask: defaultCardNumber,
                regex: visaRegex,
                cardType: 'visa',
            },
            {
                mask: defaultCardNumber,
                regex: mastercardRegex,
                cardType: 'mastercard',
            },
            {
                mask: defaultCardNumber,
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
                : defaultCardNumber;

        setCardType(cardNumberMasked.masked.currentMask.cardType);
    });
}

function setupCardholderName() {
    const cardholderNameValue = document.querySelector('.cc-holder .value');

    cardholderName.addEventListener('input', () => {
        cardholderNameValue.innerText =
            cardholderName.value.length > 0
                ? cardholderName.value
                : 'NAME SURNAME';
    });
}

function handleExpiry() {
    const expirationDateValue = document.querySelector('.cc-expiration .value');

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
    return `${String(currentMonth).padStart(2, '0')}/${currentYear + 10}`;
}

function handleCardSecurityCode() {
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

function setupAddCard() {
    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    addCardButton.addEventListener('click', handleAddCard);
}

let cardAdded = false;

function handleAddCard() {
    const canContinue = allFieldsAreFilled();

    if (!canContinue) {
        showToast('warning', 'You must fill all fields!');
        return;
    }

    if (!cardAdded) {
        showToast('success', 'Card added successfully!');
        cardAdded = true;

        addCardButton.style.backgroundColor = '#33FF6E';
        addCardButton.innerText = 'CARD ADDED';
    }
}

function allFieldsAreFilled() {
    return (
        cardNumber.value.length > 0 &&
        cardholderName.value.length > 0 &&
        expirationDate.value.length > 0 &&
        securityCode.value.length > 0
    );
}

const toasts = [];

function showToast(type, message) {
    if (toasts.includes(type)) {
        return;
    }

    const newToast = Toastify({
        text: message,
        duration: toastDuration,
        className: type,
        style: {
            background: toastColors[type],
            color: '#000000',
        },
    });

    newToast.showToast();
    toasts.push(type);

    setTimeout(() => {
        toasts.pop();
    }, toastDuration);
}

function init() {
    setupCardholderName();
    setupAddCard();

    handleCardNumber();
    handleExpiry();
    handleCardSecurityCode();
}

init();
