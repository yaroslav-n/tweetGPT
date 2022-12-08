type PromptFN = (basis: string) => string;
type PromptMap = Record<string, PromptFN>;

 const emotions = ['supportive', 'snarky', 'optimistic', 'controversial', 'excited', 'sad', 'progressive', 'conservative']
 const getRandomEmotion = () => emotions[Math.floor(Math.random() * emotions.length)];

// Prompt for a new standalone tweet
export const whatsHappeningPrompt: PromptFN = (topic) => `Write a ${getRandomEmotion()} tweet about ${topic} so it can be understood without context. Use less than 280 characters. Don't use hashtags.`;

// Promt for a reply
export const replyPrompt: PromptFN = (tweet) => `Write a ${getRandomEmotion()} reply to a tweet "${tweet}". Use less than 280 characters. Don't use hashtags.`;