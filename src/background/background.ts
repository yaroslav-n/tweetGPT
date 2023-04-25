import { ChatGPTClient, TweetProps } from "./chat_gpt_client/chat_gpt_client";

chrome.scripting.registerContentScripts([
    {
        id: `main_context_inject_${Math.random()}`,
        world: "ISOLATED",
        matches: ["https://twitter.com/*"],
        js: ["lib/inject.js"],
        css: ["css/inject.css"],
    },
]);

chrome.runtime.onInstalled.addListener(function (object) {
    let internalUrl = chrome.runtime.getURL("assets/settings.html");
    chrome.tabs.create({ url: internalUrl });
});


const gptChat = new ChatGPTClient();

type Message = {
    type: 'generate_tweet';
    props: TweetProps;
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    if (!message.type) {
        return;
    }

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
    }

    return true;
});