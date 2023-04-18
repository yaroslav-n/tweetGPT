/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/background/chat_gpt_client/locales.ts
const locales = {
    "af-ZA": [
        "Afrikaans",
        "Afrikaans"
    ],
    "ar": [
        "العربية",
        "Arabic"
    ],
    "bg-BG": [
        "Български",
        "Bulgarian"
    ],
    "ca-AD": [
        "Català",
        "Catalan"
    ],
    "cs-CZ": [
        "Čeština",
        "Czech"
    ],
    "cy-GB": [
        "Cymraeg",
        "Welsh"
    ],
    "da-DK": [
        "Dansk",
        "Danish"
    ],
    "de-AT": [
        "Deutsch (Österreich)",
        "German (Austria)"
    ],
    "de-CH": [
        "Deutsch (Schweiz)",
        "German (Switzerland)"
    ],
    "de-DE": [
        "Deutsch (Deutschland)",
        "German (Germany)"
    ],
    "el-GR": [
        "Ελληνικά",
        "Greek"
    ],
    "en-GB": [
        "English (UK)",
        "English (UK)"
    ],
    "en-US": [
        "English (US)",
        "English (US)"
    ],
    "es-CL": [
        "Español (Chile)",
        "Spanish (Chile)"
    ],
    "es-ES": [
        "Español (España)",
        "Spanish (Spain)"
    ],
    "es-MX": [
        "Español (México)",
        "Spanish (Mexico)"
    ],
    "et-EE": [
        "Eesti keel",
        "Estonian"
    ],
    "eu": [
        "Euskara",
        "Basque"
    ],
    "fa-IR": [
        "فارسی",
        "Persian"
    ],
    "fi-FI": [
        "Suomi",
        "Finnish"
    ],
    "fr-CA": [
        "Français (Canada)",
        "French (Canada)"
    ],
    "fr-FR": [
        "Français (France)",
        "French (France)"
    ],
    "he-IL": [
        "עברית",
        "Hebrew"
    ],
    "hi-IN": [
        "हिंदी",
        "Hindi"
    ],
    "hr-HR": [
        "Hrvatski",
        "Croatian"
    ],
    "hu-HU": [
        "Magyar",
        "Hungarian"
    ],
    "id-ID": [
        "Bahasa Indonesia",
        "Indonesian"
    ],
    "is-IS": [
        "Íslenska",
        "Icelandic"
    ],
    "it-IT": [
        "Italiano",
        "Italian"
    ],
    "ja-JP": [
        "日本語",
        "Japanese"
    ],
    "km-KH": [
        "ភាសាខ្មែរ",
        "Khmer"
    ],
    "ko-KR": [
        "한국어",
        "Korean"
    ],
    "la": [
        "Latina",
        "Latin"
    ],
    "lt-LT": [
        "Lietuvių kalba",
        "Lithuanian"
    ],
    "lv-LV": [
        "Latviešu",
        "Latvian"
    ],
    "mn-MN": [
        "Монгол",
        "Mongolian"
    ],
    "nb-NO": [
        "Norsk bokmål",
        "Norwegian (Bokmål)"
    ],
    "nl-NL": [
        "Nederlands",
        "Dutch"
    ],
    "nn-NO": [
        "Norsk nynorsk",
        "Norwegian (Nynorsk)"
    ],
    "pl-PL": [
        "Polski",
        "Polish"
    ],
    "pt-BR": [
        "Português (Brasil)",
        "Portuguese (Brazil)"
    ],
    "pt-PT": [
        "Português (Portugal)",
        "Portuguese (Portugal)"
    ],
    "ro-RO": [
        "Română",
        "Romanian"
    ],
    "ru-RU": [
        "Русский",
        "Russian"
    ],
    "sk-SK": [
        "Slovenčina",
        "Slovak"
    ],
    "sl-SI": [
        "Slovenščina",
        "Slovenian"
    ],
    "sr-RS": [
        "Српски / Srpski",
        "Serbian"
    ],
    "sv-SE": [
        "Svenska",
        "Swedish"
    ],
    "th-TH": [
        "ไทย",
        "Thai"
    ],
    "tr-TR": [
        "Türkçe",
        "Turkish"
    ],
    "uk-UA": [
        "Українська",
        "Ukrainian"
    ],
    "ur-PK": [
        "اردو",
        "Urdu"
    ],
    "vi-VN": [
        "Tiếng Việt",
        "Vietnamese"
    ],
    "zh-CN": [
        "中文 (中国大陆)",
        "Chinese (PRC)"
    ],
    "zh-TW": [
        "中文 (台灣)",
        "Chinese (Taiwan)"
    ]
};
const defaultLocale = 'en-US';

;// CONCATENATED MODULE: ./src/popup/popup.ts

const toggleEls = document.querySelectorAll("input");
const toggles = [];
toggleEls.forEach((te) => {
    toggles.push(te.id);
});
const updateState = async (elementId) => {
    const state = await chrome.storage.local.get(elementId);
    const value = state[elementId] ?? document.getElementById(elementId).getAttribute('checked');
    const checkboxEl = document.getElementById(elementId);
    if (value) {
        checkboxEl.setAttribute('checked', 'true');
    }
    else {
        checkboxEl.removeAttribute('checked');
    }
};
const createOnClickHandler = (elementId) => async () => {
    const state = await chrome.storage.local.get(elementId);
    const value = state[elementId] ?? document.getElementById(elementId).getAttribute('checked');
    await chrome.storage.local.set({ [elementId]: !value });
    updateState(elementId);
};
toggles.forEach(id => {
    document.getElementById(id).onclick = createOnClickHandler(id);
});
toggles.forEach(id => {
    updateState(id);
});
// language selector
(async () => {
    const state = await chrome.storage.local.get('language');
    const defaultLanguage = state['language'] ?? defaultLocale;
    const languageSelector = document.getElementById('language');
    const languageOptions = Object.keys(locales);
    languageOptions.forEach((option) => {
        const optionEl = document.createElement('option');
        optionEl.value = option;
        optionEl.innerText = locales[option][0];
        if (option === defaultLanguage) {
            optionEl.setAttribute('selected', 'true');
        }
        languageSelector.appendChild(optionEl);
    });
    languageSelector.addEventListener("change", async () => {
        const value = languageSelector.value;
        await chrome.storage.local.set({ "language": value ?? defaultLocale });
    });
})();

/******/ })()
;