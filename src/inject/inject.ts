import { addGPTButton, showErrorButton } from "./dom/add_gpt_button";
import { createObserver } from "./dom/create_observer";
import { findClosestInput } from "./dom/find_closest_input";
import { generateText } from "./utils/generate_text";
import { setInputText } from "./dom/set_input_text";
import { TwitterClient } from "./twitter_client/twitter_client";
import { replyPrompt, whatsHappeningPrompt } from "../background/chat_gpt_client/prompts";

const onToolBarAdded = (toolBarEl: Element) => {
    const inputEl = findClosestInput(toolBarEl);
    let prompt = '';
    if (inputEl) {     
        addGPTButton(toolBarEl, async (type: string) => {
            (toolBarEl as HTMLDivElement).click();
            const replyToTweet = document.querySelector("article[data-testid=\"tweet\"][tabindex=\"-1\"]");
            if (!!replyToTweet) {
                const textEl = replyToTweet.querySelector("div[data-testid=\"tweetText\"]");
                if (!textEl || !textEl.textContent) {
                    showErrorButton(toolBarEl);
                    return;
                }

                const text = textEl.textContent;
                prompt = replyPrompt(text, type);
            } else {
                const trendingResponses = await TwitterClient.getTrending();
                const trendingResponse = trendingResponses[Math.floor(Math.random() * trendingResponses.length)];
                prompt = whatsHappeningPrompt(trendingResponse, type);
            }

            const requestId = inputEl.getAttribute("aria-activedescendant")!;
            const text = await generateText(requestId, prompt);
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
            const activeInput = document.querySelector(`div[aria-activedescendant="${requestId}"]`) as HTMLInputElement;
            if (activeInput) {
                setInputText(activeInput, message.tweet);
            }

            break;
    }
});

// observe dom tree to detect all tweet inputs once they are created
const toolbarObserver = createObserver("div[data-testid=\"toolBar\"]", onToolBarAdded, onToolBarRemoved);
const reactRoot = document.querySelector("#react-root") as unknown as Node;
toolbarObserver.observe(reactRoot, { subtree: true, childList: true });
