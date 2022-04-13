//@ts-check

/**
 * INSTRUCTIONS: for now, copy and paste in an Airbnb listings result view
 */

let previousPrice = '';
let previousUrl = '';

function replacePrices() {
    const prices = [...document.querySelectorAll('[style^="--pricing"] [aria-hidden]')];

    const divs = prices.filter(el => el.nodeName === "DIV");
    const spans = prices.filter(el => el.nodeName === "SPAN");

    for (let i = 0; i < divs.length; i++) {
        const childNodes = divs[i].childNodes;
        const nightlyPriceNode = childNodes[childNodes.length - 2];

        const totalPriceNode = spans[i];
        const pricePerNight = Math.round(parseInt(totalPriceNode.textContent.replaceAll(',', '').match(/\d+/)[0]) / 3);

        replacePrice(childNodes[childNodes.length - 2], pricePerNight);
    }
};

function replacePrice(node, newPrice) {
    node.textContent = '$' + newPrice
};

replacePrices();
subscribeToListingsCardRowChanges();
subscribeToLegacyListingSectionItemChanges();
subscribeToItemListChanges();

const cardRowTextContent = [];
const legacyListingSectionItemTextContent = [];
let itemListTextContent = '';

function subscribeToListingsCardRowChanges() {
    [...document.querySelectorAll('[data-testid="listings-card-row"]')].forEach((row, idx) => {
        const observer = new MutationObserver(function () {
            if (row.textContent !== cardRowTextContent?.[idx]) {
                console.log('row textContent changed!');
                cardRowTextContent[idx] = row.textContent;
                replacePrices();
            }
        });
        const config = { subtree: true, childList: true };
        observer.observe(row, config);
    });
}

function subscribeToLegacyListingSectionItemChanges() {
    [...document.querySelectorAll('[data-testid="shimmer-legacy-listing-section-item"]')].forEach((row, idx) => {
        const observer = new MutationObserver(function () {
            if (row.textContent !== legacyListingSectionItemTextContent?.[idx]) {
                console.log('section item textContent changed!');
                legacyListingSectionItemTextContent[idx] = row.textContent;
                replacePrices();
            }
        });
        const config = { subtree: true, childList: true };
        observer.observe(row, config);
    });
}

function subscribeToItemListChanges() {
    const itemListElement = document.querySelector('[itemprop="itemListElement"]');
    const itemList = itemListElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    const observer = new MutationObserver(function () {
        if (itemList.textContent !== itemListTextContent) {
            itemListTextContent = itemList.textContent;
            replacePrices();
        }
    });
    const config = { subtree: true, childList: true };
    observer.observe(itemList, config);
}