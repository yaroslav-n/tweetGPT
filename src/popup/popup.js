const setSignatureState = async () => {
    const state = await chrome.storage.local.get('isAddSignature');
    const isAddSignature = state.isAddSignature ?? true;

    const checkboxEl = document.getElementById('signature');
    if (isAddSignature) {
        checkboxEl.setAttribute('checked', 'true');
    } else {
        checkboxEl.removeAttribute('checked');
    }
}

const onSignatureToggle = async () => {
    const state = await chrome.storage.local.get('isAddSignature');
    const isAddSignature = state.isAddSignature ?? true;

    const newIsAddSignature = !isAddSignature;
    await chrome.storage.local.set({'isAddSignature': newIsAddSignature});
    await setSignatureState();
}


setSignatureState();

document.getElementById('signature').onclick = onSignatureToggle;