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
    } else {
        checkboxEl.removeAttribute('checked');
    }
}

const createOnClickHandler = (elementId) => async () => {
    const state = await chrome.storage.local.get(elementId);
    const value = state[elementId] ?? document.getElementById(elementId).getAttribute('checked');

    await chrome.storage.local.set({[elementId]: !value});
    
    updateState(elementId);
}

toggles.forEach(id => {
    document.getElementById(id).onclick = createOnClickHandler(id);
});

toggles.forEach(id => {
    updateState(id);
});