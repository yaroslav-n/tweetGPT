type PromptFN = (basis: string, type: string) => string;

// Prompt for a new standalone tweet
export const whatsHappeningPrompt: PromptFN = (topic, type) => `Write a short ${type} tweet about ${topic} so it can be understood without context. Use less than 280 characters. Don't use hashtags.`;

// Promt for a reply
export const replyPrompt: PromptFN = (tweet, type) => `Write a short ${type} reply to a tweet "${tweet}". Use less than 280 characters. Don't use hashtags.`;