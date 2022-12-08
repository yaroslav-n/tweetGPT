export const generateText = (requestId: string, prompt: string): Promise<string | undefined> => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({type: 'generate_tweet', prompt, requestId}, response => resolve(response));
    });
};