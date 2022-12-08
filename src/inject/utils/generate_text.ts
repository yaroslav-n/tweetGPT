export const generateText = (requestId: number, prompt: string): Promise<string | undefined> => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({type: 'generate_tweet', prompt, requestId}, response => resolve(response));
    });
};