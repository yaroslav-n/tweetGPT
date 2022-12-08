import { fetchEventSource } from '@microsoft/fetch-event-source';
import { v4 as uuidv4 } from 'uuid';
import { wait } from '../../utils/wait';
// polyfill for @microsoft/fetch-event-source
global.window ||= {} as any;
global.window.fetch = fetch;
global.window.setTimeout = ((cb: any, interval: any) => {
    const timeoutId = setTimeout(cb, interval);
    return timeoutId;
}) as any;

global.window.clearTimeout = (timeoutId) => {
    return clearTimeout(timeoutId);
};

global.document ||= {} as any;
global.document.addEventListener = (_: any, __: any) => null;
global.document.removeEventListener = (_: any, __: any) => null;

const baseUrl = "https://chat.openai.com/backend-api";

export class ChatGPTClient {
    gptToken?: string;
    waitForTokenCallback: ((newGptToken: string) => void) | undefined;

    constructor() {
        chrome.storage.local.get("gpt_token").then((result) => this.gptToken = result.gpt_token);
    }


    async generateTweet(prompt: string, onPartialResults: (tweet: string) => void, onError: () => void, repeat: boolean = true): Promise<string | undefined> {
        const gptToken = await this.getOpenAIToken();
        if (!gptToken) {
            return undefined;
        }

        const payload = {
            "action":"next",
            "messages":[
                {
                    "id": uuidv4(),
                    "role":"user",
                    "content":{
                        "content_type":"text",
                        "parts":[prompt]
                    }
                }
            ],
            "parent_message_id": uuidv4(),
            "model":"text-davinci-002-render"
        };

        const self = this;
        let tweet = undefined;
        let isValidToken = true;
        try {
            const ctrl = new AbortController();
            await fetchEventSource(`${baseUrl}/conversation`, {
                method: 'POST',
                openWhenHidden: true,
                fetch: fetch,
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${this.gptToken}`,
                },
                body: JSON.stringify(payload),
                onopen: async (response) => {
                    if (response.status === 401 || response.status === 403) {
                        // token expired or invalid
                        isValidToken = false;
                    }

                    if (response.status >= 500) {
                        onError();
                    }
                },
                onerror: (error) => {
                    throw new Error(error); //it wouldn't stop otherwise
                },
                onclose: () => {
                    onError();
                },
                onmessage(ev) {
                    if (ev.data === '[DONE]') {
                        ctrl.abort();
                    } else {
                        tweet = self.getTextFromResponse(ev.data);
                        onPartialResults(tweet);
                    }
                },
                signal: ctrl.signal,
            });
        } catch(e) {
            onError();
            console.log(e);
        }

        if (!isValidToken) {
            this.gptToken = undefined;
        }

        // we didn't get a tweet because token wasn't valid
        if (!tweet && !isValidToken && repeat) {
            const newToken = await this.getOpenAIToken();
            if (newToken) {
                return this.generateTweet(prompt, onPartialResults, onError, false); // we repeat only once
            }
        }

        return tweet;
    }

    getTextFromResponse(response: string): string {
        const message = JSON.parse(response);
        let tweet = message?.message?.content?.parts[0] || '';
        tweet = tweet.trim().replace(/"([^"]*)[#"]?/g, '$1');

        return tweet;
    }

    updateToken(token: string) {
        this.gptToken = token;
        chrome.storage.local.set({"gpt_token": token});
        if (this.waitForTokenCallback) {
            this.waitForTokenCallback(token);
            this.waitForTokenCallback = undefined;
        }
    }

    async getOpenAIToken(): Promise<string | undefined> {
        if (!this.gptToken) {
            var chatUrl = "https://chat.openai.com/";
            chrome.windows.create({ url: chatUrl });

            return Promise.race([
                new Promise<string>((resolve) => {
                    this.waitForTokenCallback = resolve;
                }),
                wait(10000).then(() => { // 15s timeout for user to login
                    this.waitForTokenCallback = undefined;
                    return undefined;
                })
            ]);
        }

        return this.gptToken;
    }
}   