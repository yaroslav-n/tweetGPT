import { ChatGPTClient } from "./chat_gpt_client/chat_gpt_client";

const gptChat = new ChatGPTClient();

type Message = {
    type: 'generate_tweet';
    prompt: string;
    requestId: number;
} | {
    type: 'new_openai_token';
    token: string;
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    if (!message.type) {
        return;
    }

    switch(message.type) {
        case 'generate_tweet':
            const requestId = message.requestId;
            const onPartialResults = (tweet: string) => chrome.tabs.sendMessage(sender.tab!.id!, {type: 'partial_tweet', tweet, requestId});
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
        case 'new_openai_token':
            const token = message.token;
            gptChat.updateToken(token);
            chrome.tabs.sendMessage(sender.tab!.id!, {type: 'close_openai_window'})
            break;
    }

    return true;
});