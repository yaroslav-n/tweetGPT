import { wait } from '../../utils/wait';
const baseUrl = "https://api.tweetgpt.app";
const GPT_TOKEN_NAME = 'gpt_token';

export type TweetProps = {
    type: string,
    topic?: string,
    locale: string,
    replyTo?: string,
}

export class ChatGPTClient {
    waitForTokenCallback: ((newGptToken: string) => void) | undefined;
    async generateTweet(props: TweetProps, repeat: boolean = true): Promise<string | undefined> {
        const gptToken = await this.getToken();
        if (!gptToken) {
            if (repeat) { // repeat only once
                return this.generateTweet(props, false);
            }
            return undefined;
        }

        let tweet: string | undefined = undefined;
        try {
            const response = await fetch(`${baseUrl}/tweet/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${gptToken}`,
                },
                body: JSON.stringify(props),
            });

            if (response.status === 403) {
                console.error(response.body);
                await chrome.storage.local.remove(GPT_TOKEN_NAME)
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
        } catch(e) {
            console.error(e);
            return Promise.reject();
        }

        return tweet;
    }

    getTextFromResponse(response: string): string {
        const message = JSON.parse(response);
        let tweet = message?.message?.content?.parts[0] || '';
        tweet = tweet.trim().replace(/"([^"]*)[#"]?/g, '$1');

        return tweet;
    }

    async exchangeFirebaseToken(token: string) {
        const manifestData = chrome.runtime.getManifest();
        const payload = {
            "firebase_token": token,
            "platform": "chrome",
            "appVersion": manifestData.version,
        };

        const response = await fetch(`${baseUrl}/auth/token?`+ new URLSearchParams(payload));

        if (response.status === 200) {
            const data = await response.json();
            return data.token;
        }
        
        return null;
    };

    async updateToken(firebaseToken: string) {
        // exchange token
        const token = await this.exchangeFirebaseToken(firebaseToken);

        if (!token) {
            return null;
        }

        chrome.storage.local.set({[GPT_TOKEN_NAME]: token});
        if (this.waitForTokenCallback) {
            this.waitForTokenCallback(token);
            this.waitForTokenCallback = undefined;
        }
    }

    async getToken(): Promise<string | undefined> {
        const result = (await chrome.storage.local.get(GPT_TOKEN_NAME)) || {};
        if (!result[GPT_TOKEN_NAME]) {
            var chatUrl = "https://tweetgpt.app/";
            chrome.windows.create({ url: chatUrl });

            return await Promise.race([
                new Promise<string>((resolve) => {
                    this.waitForTokenCallback = resolve;
                }),
                wait(20000).then(() => { // 20s timeout for user to login
                    this.waitForTokenCallback = undefined;
                    return undefined;
                })
            ]);
        }

        return result[GPT_TOKEN_NAME];
    }
}