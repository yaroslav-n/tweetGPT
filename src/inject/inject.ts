import { addGPTButton, showErrorButton } from "./dom/add_gpt_button";
import { createObserver } from "./dom/create_observer";
import { findClosestInput } from "./dom/find_closest_input";
import { generateText } from "./utils/generate_text";
import { setInputText, setInputTextWithDebounce } from "./dom/set_input_text";
import { TwitterClient } from "./twitter_client/twitter_client";
import { replyPrompt, whatsHappeningPrompt } from "../background/chat_gpt_client/prompts";

// inputs that are waiting for gpt data
let activeInputs: Array<{
    requestId: number
    toolbar: Element,
    input: Element,
}> = [];

const onToolBarAdded = (toolBarEl: Element) => {
    const inputEl = findClosestInput(toolBarEl);
    let prompt = '';
    if (inputEl) {     
        addGPTButton(toolBarEl, async () => {
            const replyToTweet = document.querySelector("article[data-testid=\"tweet\"][tabindex=\"-1\"]");
            if (!!replyToTweet) {
                const textEl = replyToTweet.querySelector("div[data-testid=\"tweetText\"]");
                if (!textEl || !textEl.textContent) {
                    showErrorButton(toolBarEl);
                    return;
                }

                const text = textEl.textContent;
                prompt = replyPrompt(text);
            } else {
                const trendingResponses = await TwitterClient.getTrending();
                const trendingResponse = trendingResponses[Math.floor(Math.random() * trendingResponses.length)];
                prompt = whatsHappeningPrompt(trendingResponse);
            }

            const requestId = Math.random();
            activeInputs.push({
                requestId,
                toolbar: toolBarEl,
                input: inputEl,
            });
            const text = await generateText(requestId, prompt);
            activeInputs = activeInputs.filter((ai) => ai.requestId != requestId);
            if (text) {
                setInputText(inputEl, text);
            } else { // show error
                showErrorButton(toolBarEl);
            }
        });
    }
}

const onToolBarRemoved = (toolBarEl: Element) => {}


// waiting for background events
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message.type) {
        return;
    }

    switch(message.type) {
        case 'partial_tweet':
            const requestId = message.requestId;
            const activeInput = activeInputs.find((ai) => ai.requestId === requestId);
            if (activeInput) {
                setInputTextWithDebounce(activeInput.input, message.tweet, 200);
            }

            break;
    }
});


// observe dom tree to detect all tweet inputs once they are created
const toolbarObserver = createObserver("div[data-testid=\"toolBar\"]", onToolBarAdded, onToolBarRemoved);
const reactRoot = document.querySelector("#react-root") as unknown as Node;
toolbarObserver.observe(reactRoot, { subtree: true, childList: true });
