import { addGPTButton, showErrorButton } from "./dom/add_gpt_button";
import { createObserver } from "./dom/create_observer";
import { findClosestInput } from "./dom/find_closest_input";
import { generateText } from "./utils/generate_text";
import { setInputText } from "./dom/set_input_text";
import { TwitterClient } from "./twitter_client/twitter_client";
const onToolBarAdded = (toolBarEl: Element) => {
    const inputEl = findClosestInput(toolBarEl);
    if (inputEl) {     
        addGPTButton(toolBarEl, async (type: string) => {
            (toolBarEl as HTMLDivElement).click();
            const replyToTweet = document.querySelector("article[data-testid=\"tweet\"][tabindex=\"-1\"]");
            let replyTo: string | undefined = undefined;
            let topic: string | undefined = undefined;
            if (!!replyToTweet) {
                const textEl = replyToTweet.querySelector("div[data-testid=\"tweetText\"]");
                if (!textEl || !textEl.textContent) {
                    showErrorButton(toolBarEl);
                    return;
                }

                replyTo = textEl.textContent;
            } else {
                const trendingResponses = await TwitterClient.getTrending();
                topic = trendingResponses[Math.floor(Math.random() * trendingResponses.length)];
            }

            const text = await generateText({
                locale: 'en-us',
                type,
                replyTo,
                topic
            });
            if (text) {
                setInputText(inputEl, text);
            } else { // show error
                showErrorButton(toolBarEl);
            }
        });
    }
}

const onToolBarRemoved = (toolBarEl: Element) => {}

// observe dom tree to detect all tweet inputs once they are created
const toolbarObserver = createObserver("div[data-testid=\"toolBar\"]", onToolBarAdded, onToolBarRemoved);
const reactRoot = document.querySelector("#react-root") as unknown as Node;
toolbarObserver.observe(reactRoot, { subtree: true, childList: true });