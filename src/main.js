import IMask from 'imask';
import Toastify from 'toastify-js';

import './css/index.css';
import 'toastify-js/src/toastify.css';

function handleCardType() {
    const colors = {
        visa: ['#436D99', '#2D57F2'],
        mastercard: ['#DF6F29', '#C69347'],
        default: ['black', 'gray'],
    };

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

    function setCardType(type) {
        cardBackgroundColor01.setAttribute('fill', colors[type][0]);
        cardBackgroundColor02.setAttribute('fill', colors[type][1]);
        cardLogo.setAttribute('src', `cc-${type}.svg`);
    }
}

function handleCardNumber() {
    const cardNumber = document.querySelector('#card-number');

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

    IMask(cardNumber, cardNumberPattern);
}

function handleCardholderName() {}

function handleExpiry() {
    const expirationDate = document.querySelector('#expiration-date');
    const currentYear = new Date().getFullYear();

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

    IMask(expirationDate, expirationDatePattern);
}

function handleCardSecurityCode() {
    const securityCode = document.querySelector('#security-code');

    const securityCodePattern = {
        mask: '000',
    };

    IMask(securityCode, securityCodePattern);
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
    handleCardType();
    handleCardNumber();
    handleCardholderName();
    handleExpiry();
    handleCardSecurityCode();
    handleAddCard();
}

init();
