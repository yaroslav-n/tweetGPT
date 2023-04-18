import { ChatGPTClient, TweetProps } from "./chat_gpt_client/chat_gpt_client";

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
        world: "MAIN",
        matches: ["https://tweetgpt.app/*"],
        js: ["lib/inject_tweetgpt_main.js"],
        runAt: "document_start",
    },
    {
        id: `tweetgpt_isolated_context_inject_${Math.random()}`,
        world: "ISOLATED",
        matches: ["https://tweetgpt.app/*"],
        js: ["lib/inject_tweetgpt.js"],
        runAt: "document_start",
    },
]);

const gptChat = new ChatGPTClient();

type Message = {
    type: 'generate_tweet';
    props: TweetProps;
} | {
    type: 'new_firebase_token';
    token: string;
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    if (!message.type) {
        return;
    }

    console.log('>>> message', message);

    switch(message.type) {
        case 'generate_tweet':
            gptChat.generateTweet(message.props).then(
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
                () => sendResponse(undefined)
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