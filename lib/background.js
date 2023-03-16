/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/utils/wait.ts
const wait = (timeout) => {
    return new Promise((res) => setTimeout(() => res(null), timeout));
};

;// CONCATENATED MODULE: ./src/background/chat_gpt_client/chat_gpt_client.ts

const baseUrl = "https://api.tweetgpt.app";
class ChatGPTClient {
    gptToken;
    waitForTokenCallback;
    constructor() {
        chrome.storage.local.get("gpt_token").then((result) => this.gptToken = result.gpt_token);
    }
    async generateTweet(props, repeat = true) {
        const gptToken = await this.getToken();
        if (!gptToken) {
            return undefined;
        }
        let tweet = undefined;
        try {
            const response = await fetch(`${baseUrl}/tweet/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${this.gptToken}`,
                },
                body: JSON.stringify(props),
            });
            if (response.status === 403) {
                console.error(response.body);
                this.gptToken = undefined;
                const newToken = await this.getToken();
                if (newToken && repeat) { // repeat only once
                    return this.generateTweet(props, false);
                }
                return Promise.reject();
            }
            if (response.status !== 200) {
                console.error(response.body);
                return Promise.reject();
            }
            const responseJSON = await response.json();
            tweet = responseJSON?.tweet;
        }
        catch (e) {
            console.error(e);
            return Promise.reject();
        }
        return tweet;
    }
    getTextFromResponse(response) {
        const message = JSON.parse(response);
        let tweet = message?.message?.content?.parts[0] || '';
        tweet = tweet.trim().replace(/"([^"]*)[#"]?/g, '$1');
        return tweet;
    }
    async exchangeFirebaseToken(token) {
        const manifestData = chrome.runtime.getManifest();
        const payload = {
            "firebase_token": token,
            "platform": "chrome",
            "appVersion": manifestData.version,
        };
        const response = await fetch(`${baseUrl}/auth/token?` + new URLSearchParams(payload));
        if (response.status === 200) {
            const data = await response.json();
            return data.token;
        }
        return null;
    }
    ;
    async updateToken(firebaseToken) {
        // exchange token
        const token = await this.exchangeFirebaseToken(firebaseToken);
        if (!token) {
            return null;
        }
        this.gptToken = token;
        chrome.storage.local.set({ "gpt_token": token });
        if (this.waitForTokenCallback) {
            this.waitForTokenCallback(token);
            this.waitForTokenCallback = undefined;
        }
    }
    async getToken() {
        if (!this.gptToken) {
            var chatUrl = "https://tweetgpt.app/";
            chrome.windows.create({ url: chatUrl });
            return Promise.race([
                new Promise((resolve) => {
                    this.waitForTokenCallback = resolve;
                }),
                wait(15000).then(() => {
                    this.waitForTokenCallback = undefined;
                    return undefined;
                })
            ]);
        }
        return this.gptToken;
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

/******/ })()
;