import { wait } from '../../utils/wait';
const baseUrl = "https://api.tweetgpt.app";

export type TweetProps = {
    type: string,
    topic?: string,
    locale: string,
    replyTo?: string,
}

export class ChatGPTClient {
    gptToken?: string;
    waitForTokenCallback: ((newGptToken: string) => void) | undefined;

    constructor() {
        chrome.storage.local.get("gpt_token").then((result) => this.gptToken = result.gpt_token);
    }

    async generateTweet(props: TweetProps, repeat: boolean = true): Promise<string | undefined> {
        const gptToken = await this.getToken();
        if (!gptToken) {
            return undefined;
        }

        let tweet: string | undefined = undefined;
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

        this.gptToken = token;
        chrome.storage.local.set({"gpt_token": token});
        if (this.waitForTokenCallback) {
            this.waitForTokenCallback(token);
            this.waitForTokenCallback = undefined;
        }
    }

    async getToken(): Promise<string | undefined> {
        if (!this.gptToken) {
            var chatUrl = "https://tweetgpt.app/";
            chrome.windows.create({ url: chatUrl });

            return Promise.race([
                new Promise<string>((resolve) => {
                    this.waitForTokenCallback = resolve;
                }),
                wait(15000).then(() => { // 15s timeout for user to login
                    this.waitForTokenCallback = undefined;
                    return undefined;
                })
            ]);
        }

        return this.gptToken;
    }
}   