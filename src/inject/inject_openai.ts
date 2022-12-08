type Message = {
    type: 'close_openai_window';
}

const el = document.querySelector("script[id=\"__NEXT_DATA__\"]");

if (el && el.textContent) {
    const text = el.textContent;

    let json: Record<any, any> = {};
    try {
        json = JSON.parse(text);
    } catch (_) {}

    const token = json.props?.pageProps?.accessToken;
    if (token) {
        chrome.runtime.sendMessage({type: 'new_openai_token', token});
    }
}


chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    if (!message.type) {
        return;
    }

    switch(message.type) {
        case 'close_openai_window':
            window.setTimeout(() => window.close(), 1);
            break;
    }
});