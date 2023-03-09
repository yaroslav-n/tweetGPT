import { TweetProps } from "../../background/chat_gpt_client/chat_gpt_client";

export const generateText = (props: TweetProps): Promise<string | undefined> => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({type: 'generate_tweet', props}, response => resolve(response));
    });
};