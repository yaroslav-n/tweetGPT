/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/background/chat_gpt_client/chat_gpt_client.ts
const GPT_TOKEN_NAME = 'openAIToken';
class ChatGPTClient {
    waitForTokenCallback;
    async generateTweet(props) {
        const token = await this.getToken();
        if (!token) {
            return Promise.reject();
        }
        const systemMessage = `You are a ghostwriter for users tweets. Use locale "${props.locale}". Return only one tweet. Keep it short.`;
        const systemMessage2 = "Exclude everything after the tweet. Exclude hashtags. Exclude emojis. Don't apologize. Don't provide translation. Don't provide notes. Exclude сalls to action.";
        const userMessage = `Write a ${props.type} tweet${props.topic ? ` about ${props.topic}` : ""}${props.replyTo ? ` in reply to a tweet "${props.replyTo}"` : ""}`;
        const body = {
            stream: false,
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemMessage },
                { role: "system", content: systemMessage2 },
                { role: "user", content: userMessage },
            ],
        };
        try {
            const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            if (response.status === 403) {
                await chrome.storage.local.remove(GPT_TOKEN_NAME);
            }
            if (response.status !== 200) {
                console.error(response.body);
                chrome.notifications.create("TextGenerationError", {
                    type: 'basic',
                    iconUrl: "./icons/32.png",
                    title: 'Error',
                    message: JSON.stringify(response.body),
                    priority: 2,
                });
                return Promise.reject();
            }
            const responseJSON = await response.json();
            const tweet = responseJSON?.choices[0].message?.content || '';
            return tweet.trim()
                .replace(/^\"/g, "")
                .replace(/\"$/g, "")
                .trim();
        }
        catch (e) {
            console.error(e);
            return Promise.reject();
        }
    }
    getTextFromResponse(response) {
        const message = JSON.parse(response);
        let tweet = message?.message?.content?.parts[0] || '';
        tweet = tweet.trim().replace(/"([^"]*)[#"]?/g, '$1');
        return tweet;
    }
    async getToken() {
        const result = await chrome.storage.local.get(GPT_TOKEN_NAME);
        if (!result[GPT_TOKEN_NAME]) {
            let internalUrl = chrome.runtime.getURL("assets/settings.html");
            chrome.tabs.create({ url: internalUrl });
        }
        return result[GPT_TOKEN_NAME];
    }
}

;// CONCATENATED MODULE: ./src/background/background.ts

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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message.type) {
        return;
    }
    switch (message.type) {
        case 'generate_tweet':
            gptChat.generateTweet(message.props).then(async (text) => {
                if (!text) {
                    return sendResponse(undefined);
                }
                let finalText = text;
                const savedSettings = await chrome.storage.local.get('isAddSignature');
                const isAddSignature = savedSettings.isAddSignature ?? true;
                if (isAddSignature) {
                    finalText = text + ' — tweetGPT';
                }
                sendResponse(finalText);
            }, () => sendResponse(undefined));
            break;
    }
    return true;
});

/******/ })()
;