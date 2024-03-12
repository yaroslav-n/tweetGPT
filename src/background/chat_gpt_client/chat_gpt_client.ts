const GPT_TOKEN_NAME = 'openAIToken';

export type TweetProps = {
    type: string,
    topic?: string,
    locale: string,
    replyTo?: string,
}

export class ChatGPTClient {
    waitForTokenCallback: ((newGptToken: string) => void) | undefined;
    async generateTweet(props: TweetProps): Promise<string | undefined> {
        const token = await this.getToken();

        if (!token) {
            return Promise.reject();
        }

        const systemMessage = `You are a ghostwriter for users tweets. Use locale "${props.locale}". Return only one tweet. Keep it short.`;
        const systemMessage2 =
            "Exclude everything after the tweet. Exclude hashtags. Exclude emojis. Don't apologize. Don't provide translation. Don't provide notes. Exclude сalls to action.";
        const userMessage = `Write a ${props.type} tweet${
            props.topic ? ` about ${props.topic}` : ""
        }${props.replyTo ? ` in reply to a tweet "${props.replyTo}"` : ""}`;

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
                await chrome.storage.local.remove(GPT_TOKEN_NAME)
            }

            if (response.status !== 200) {
                console.error(JSON.stringify(response.body));
                chrome.notifications.create(
                    "TextGenerationError",
                    {
                      type: 'basic',
                      iconUrl: "./icons/32.png",
                      title: 'Error',
                      message: JSON.stringify(response.body),
                      priority: 2,
                    }
                  );
                return Promise.reject();
            }

            const responseJSON = await response.json();
            const tweet = responseJSON?.choices[0].message?.content || '';
            return tweet.trim()
                .replace(/^\"/g, "")
                .replace(/\"$/g, "")
                .trim();
        } catch(e) {
            console.error(e);
            return Promise.reject();
        }
    }

    getTextFromResponse(response: string): string {
        const message = JSON.parse(response);
        let tweet = message?.message?.content?.parts[0] || '';
        tweet = tweet.trim().replace(/"([^"]*)[#"]?/g, '$1');

        return tweet;
    }

    async getToken(): Promise<string | undefined> {
        const result = await chrome.storage.local.get(GPT_TOKEN_NAME);

        if (!result[GPT_TOKEN_NAME]) {
            let internalUrl = chrome.runtime.getURL("assets/settings.html");
            chrome.tabs.create({ url: internalUrl });
        }

        return result[GPT_TOKEN_NAME];
    }
}