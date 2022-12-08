/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

const el = document.querySelector("script[id=\"__NEXT_DATA__\"]");
if (el && el.textContent) {
    const text = el.textContent;
    let json = {};
    try {
        json = JSON.parse(text);
    }
    catch (_) { }
    const token = json.props?.pageProps?.accessToken;
    if (token) {
        chrome.runtime.sendMessage({ type: 'new_openai_token', token });
    }
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message.type) {
        return;
    }
    switch (message.type) {
        case 'close_openai_window':
            window.setTimeout(() => window.close(), 1);
            break;
    }
});

/******/ })()
;