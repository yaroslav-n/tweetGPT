/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

const token = localStorage.getItem('token');
if (token) {
    chrome.runtime.sendMessage({ type: "new_firebase_token", token });
}
window.addEventListener('storage', async (event) => {
    if (event.storageArea === localStorage) {
        if (event.key === 'token') {
            await chrome.runtime.sendMessage({ type: "new_firebase_token", token: event.newValue });
        }
    }
}, false);

/******/ })()
;