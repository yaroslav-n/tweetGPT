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

const setRealtimeState = async () => {
    const state = await chrome.storage.local.get('isRealtime');
    const isRealtime = state.isRealtime ?? true;

    const checkboxEl = document.getElementById('realtime');
    if (isRealtime) {
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

const onRealtimeToggle = async () => {
    const state = await chrome.storage.local.get('isRealtime');
    const isRealtime = state.isRealtime ?? true;

    const newIsRealtime= !isRealtime;
    await chrome.storage.local.set({'isRealtime': newIsRealtime});
    await setRealtimeState();
}



setSignatureState();
setRealtimeState();


document.getElementById('signature').onclick = onSignatureToggle;
document.getElementById('realtime').onclick = onRealtimeToggle;