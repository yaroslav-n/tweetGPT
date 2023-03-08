import { ChatGPTClient } from "./chat_gpt_client/chat_gpt_client";

chrome.scripting.registerContentScripts([
    {
        id: `main_context_inject_${Math.random()}`,
        world: "ISOLATED",
        matches: ["https://twitter.com/*"],
        js: ["lib/inject.js"],
        css: ["css/inject.css"],
    },
    {
        id: `tweetgpt_main_context_inject_${Math.random()}`,
        world: "ISOLATED",
        matches: ["https://tweetgpt.web.app/*"],
        js: ["lib/inject_tweetgpt.js"],
        runAt: "document_start",
    },
]);

const gptChat = new ChatGPTClient();

type Message = {
    type: 'generate_tweet';
    prompt: string;
    requestId: number;
} | {
    type: 'new_firebase_token';
    token: string;
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    if (!message.type) {
        return;
    }

    switch(message.type) {
        case 'generate_tweet':
            const requestId = message.requestId;
            const onPartialResults = async (tweet: string) => {
                const { isRealtime } = await chrome.storage.local.get('isRealtime');
                if (isRealtime) {
                    chrome.tabs.sendMessage(sender.tab!.id!, {type: 'partial_tweet', tweet, requestId})
                }
            };
            const onError = (repeat?: boolean) => sendResponse(undefined);
            gptChat.generateTweet(message.prompt, onPartialResults, onError).then(
                async (text) => {
                    if (!text) {
                        return sendResponse(undefined);
                    }
                    
                    let finalText = text;
                    const savedSettings = await chrome.storage.local.get('isAddSignature')
                    const isAddSignature = savedSettings.isAddSignature ?? true;
                    if (isAddSignature) {
                        finalText = text + ' — tweetGPT';
                    }
                    sendResponse(finalText);
                }, 
                onError,
            );
            break;
        case 'new_firebase_token':
            const token = message.token;
            gptChat.updateToken(token);
            if (sender.tab?.id) {
                chrome.tabs.remove(sender.tab?.id);
            }
            break;
    }

    return true;
});