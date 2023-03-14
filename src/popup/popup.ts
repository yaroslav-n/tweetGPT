import { locales, defaultLocale } from '../background/chat_gpt_client/locales';

const toggleEls = document.querySelectorAll("input");
const toggles: string[] = [];

toggleEls.forEach((te) => {
    toggles.push(te.id);
});

const updateState = async (elementId: string) => {
    const state = await chrome.storage.local.get(elementId);
    const value = state[elementId] ?? document.getElementById(elementId)!.getAttribute('checked');

    const checkboxEl = document.getElementById(elementId)!;
    if (value) {
        checkboxEl.setAttribute('checked', 'true');
    } else {
        checkboxEl.removeAttribute('checked');
    }
}

const createOnClickHandler = (elementId: string) => async () => {
    const state = await chrome.storage.local.get(elementId)!;
    const value = state[elementId] ?? document.getElementById(elementId)!.getAttribute('checked');

    await chrome.storage.local.set({[elementId]: !value});
    
    updateState(elementId);
}

toggles.forEach(id => {
    document.getElementById(id)!.onclick = createOnClickHandler(id);
});

toggles.forEach(id => {
    updateState(id);
});

// language selector
(async () => {
    const state = await chrome.storage.local.get('language');
    const defaultLanguage = state['language'] ?? defaultLocale;
    const languageSelector = document.getElementById('language') as HTMLSelectElement;
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
        await chrome.storage.local.set({"language": value ?? defaultLocale});
    });
})();