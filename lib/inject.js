/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/utils/wait.ts
const wait = (timeout) => {
    return new Promise((res) => setTimeout(() => res(null), timeout));
};

;// CONCATENATED MODULE: ./src/inject/dom/add_gpt_button.ts

const gptIconSrc = chrome.runtime.getURL("icons/button.svg");
const gptIconErrorSrc = chrome.runtime.getURL("icons/button_error.svg");
const tweetTypes = [
    { emoji: '👍', type: 'supportive' },
    { emoji: '🎩', type: 'snarky' },
    { emoji: '🌤️', type: 'optimistic' },
    { emoji: '🔥', type: 'controversial' },
    { emoji: '🤩', type: 'excited' },
    { emoji: '🧠', type: 'smart' },
    { emoji: '🤠', type: 'hillbilly' },
    { emoji: '🏴‍☠️', type: 'pirate' },
    { emoji: '🤣', type: 'humorous' },
    { emoji: '🙄', type: 'passive aggressive' }
];
const addGPTButton = async (toolbarEl, onClick) => {
    const state = await chrome.storage.local.get('isRandomType');
    const isRandomType = state.isRandomType ?? false;
    if (isRandomType) {
        addGPTButtonRandom(toolbarEl, onClick);
    }
    else {
        addGPTButtonWithType(toolbarEl, onClick);
    }
};
const addGPTButtonRandom = (toolbarEl, onClick) => {
    const buttonContainer = toolbarEl.children[0]; // doesn't have it's own readable class / testId
    // create icon component
    const gptIcon = document.createElement('img');
    gptIcon.classList.add("gptIcon");
    gptIcon.setAttribute("src", gptIconSrc);
    // create icon wrapper
    const gptIconWrapper = document.createElement('div');
    gptIconWrapper.classList.add("gptIconWrapper");
    gptIconWrapper.appendChild(gptIcon);
    gptIconWrapper.onclick = async () => {
        gptIconWrapper.classList.add("loading");
        const typeObj = tweetTypes[Math.floor(Math.random() * tweetTypes.length)];
        await onClick(typeObj.type);
        gptIconWrapper.classList.remove("loading");
    };
    // attach to container
    buttonContainer.appendChild(gptIconWrapper);
};
const addGPTButtonWithType = (toolbarEl, onClick) => {
    const doc = new DOMParser().parseFromString(`
        <div class="gptIconWrapper" id="gptButton">
            <img class="gptIcon" src="${gptIconSrc}" />
        </div>
    `, "text/html");
    const iconWrap = doc.querySelector("div[id=\"gptButton\"]");
    const buttonContainer = toolbarEl.children[0];
    // attach to container
    buttonContainer.appendChild(iconWrap);
    iconWrap.onclick = async () => {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = iconWrap.getBoundingClientRect();
        const top = elemRect.top - bodyRect.top;
        const left = elemRect.left - bodyRect.left + 40;
        let optionsList;
        let dismissHandler;
        optionsList = createOptionsList(async (type) => {
            if (dismissHandler) {
                document.body.removeEventListener('click', dismissHandler);
            }
            if (optionsList) {
                optionsList.remove();
            }
            iconWrap.classList.add("loading");
            await onClick(type);
            iconWrap.classList.remove("loading");
        });
        optionsList.style.left = `${left}px`;
        optionsList.style.top = `${top}px`;
        document.body.appendChild(optionsList);
        dismissHandler = () => {
            if (dismissHandler) {
                document.body.removeEventListener('click', dismissHandler);
            }
            if (optionsList) {
                optionsList.remove();
            }
        };
        window.setTimeout(() => {
            document.body.addEventListener('click', dismissHandler);
        }, 1);
    };
};
const createOptionsList = (onClick) => {
    const container = document.createElement("div");
    container.classList.add("gptSelectorContainer");
    for (const tt of tweetTypes) {
        const item = document.createElement("div");
        item.classList.add("gptSelector");
        item.innerHTML = `${tt.emoji}&nbsp;&nbsp;${tt.type}`;
        item.onclick = (e) => {
            e.stopPropagation();
            onClick(tt.type);
        };
        container.appendChild(item);
    }
    return container;
};
const showErrorButton = async (toolbarEl) => {
    const gptIcon = toolbarEl.querySelector(".gptIcon");
    if (gptIcon) {
        gptIcon.setAttribute("src", gptIconErrorSrc);
        gptIcon.classList.add("error");
    }
    await wait(5000);
    gptIcon?.setAttribute("src", gptIconSrc);
    gptIcon?.classList.remove("error");
};

;// CONCATENATED MODULE: ./src/inject/dom/create_observer.ts
const createObserver = (selector, onInputAdded, onInputRemoved) => {
    return new MutationObserver((mutations_list) => {
        mutations_list.forEach((mutation) => {
            const addedNodes = mutation.addedNodes; // wrong typings
            addedNodes.forEach((added_node) => {
                if (added_node.querySelector) {
                    const inputEl = added_node.querySelector(selector);
                    if (!!inputEl) {
                        onInputAdded(inputEl);
                    }
                    ;
                }
            });
            const removedNodes = mutation.removedNodes;
            removedNodes.forEach((removed_node) => {
                if (removed_node.querySelector) {
                    const inputEl = removed_node.querySelector(selector);
                    if (!!inputEl) {
                        onInputRemoved(inputEl);
                    }
                    ;
                }
            });
        });
    });
};

;// CONCATENATED MODULE: ./src/inject/dom/find_closest_input.ts
// can be more optimised, but ¯\_(ツ)_/¯, typically common container is just 2-3 levels higher
const findClosestInput = (el) => {
    const inputEl = el.querySelector("div[data-testid^=\"tweetTextarea_\"][role=\"textbox\"]");
    if (inputEl) {
        return inputEl;
    }
    if (!el.parentElement) {
        return null;
    }
    else {
        return findClosestInput(el.parentElement);
    }
};

;// CONCATENATED MODULE: ./src/inject/utils/generate_text.ts
const generateText = (requestId, prompt) => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'generate_tweet', prompt, requestId }, response => resolve(response));
    });
};

;// CONCATENATED MODULE: ./src/inject/dom/set_input_text.ts

const setInputText = async (inputEl, text) => {
    inputEl.focus();
    await wait(1);
    try {
        document.execCommand('selectAll');
    }
    catch (e) { }
    try {
        document.execCommand('insertText', false, text);
    }
    catch (e) { }
};

;// CONCATENATED MODULE: ./src/inject/utils/get_cookie.ts
const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

;// CONCATENATED MODULE: ./src/inject/twitter_client/twitter_client.ts

const baseUrl = 'https://twitter.com/i/api/2';
const bearerToken = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'; // same for everyone
class TwitterClient {
    static async getTrending() {
        const response = await this.sendRequest('/guide.json', {
            query: {
                include_profile_interstitial_type: "1",
                include_blocking: "1",
                include_blocked_by: "1",
                include_followed_by: "1",
                include_want_retweets: "1",
                include_mute_edge: "1",
                include_can_dm: "1",
                include_can_media_tag: "1",
                include_ext_has_nft_avatar: "1",
                include_ext_is_blue_verified: "1",
                skip_status: "1",
                cards_platform: "Web-12",
                include_cards: "1",
                include_ext_alt_text: "true",
                include_ext_limited_action_results: "false",
                include_quote_count: "true",
                include_reply_count: "1",
                tweet_mode: "extended",
                include_ext_collab_control: "true",
                include_entities: "true",
                include_user_entities: "true",
                include_ext_media_color: "true",
                include_ext_media_availability: "true",
                include_ext_sensitive_media_warning: "true",
                include_ext_trusted_friends_metadata: "true",
                send_error_codes: "true",
                simple_quoted_tweet: "true",
                count: "20",
                display_location: "web_sidebar",
                include_page_configuration: "false",
                entity_tokens: "false",
                ext: "mediaStats,highlightedLabel,hasNftAvatar,voiceInfo,enrichments,superFollowMetadata,unmentionInfo,editControl,collab_control,vibe",
            }
        }).catch(() => null);
        if (!response) {
            return [];
        }
        let json = {}; // trust me bro
        try {
            json = await response.json();
        }
        catch (e) {
            return [];
        }
        const instructions = json.timeline.instructions;
        const entries = instructions.find((i) => !!i.addEntries);
        if (!entries) {
            return [];
        }
        const topicEntries = entries.addEntries.entries.find((e) => {
            return e.content?.timelineModule?.clientEventInfo?.component === 'unified_events';
        });
        if (!topicEntries) {
            return [];
        }
        const items = topicEntries.content.timelineModule.items
            .map((i) => i.item.content?.trend?.name)
            .filter((i) => !!i);
        return items;
    }
    static async sendRequest(relativeUrl, props) {
        const csrfToken = getCookie("ct0");
        const requestUrl = new URL(baseUrl + relativeUrl);
        for (const qid in Object.keys(props.query)) {
            requestUrl.searchParams.set(qid, props.query[qid]);
        }
        const init = {
            method: 'GET',
            headers: {
                authorization: `Bearer ${bearerToken}`,
                'x-csrf-token': csrfToken,
                'x-twitter-active-user': 'yes',
                'x-twitter-auth-type': 'OAuth2Session',
                'x-twitter-client-language': 'en'
            }
        };
        if (props.body) {
            init.method = 'POST';
            init.body = props.body;
        }
        return fetch(requestUrl.toString(), init);
    }
}

;// CONCATENATED MODULE: ./src/background/chat_gpt_client/prompts.ts
// Prompt for a new standalone tweet
const whatsHappeningPrompt = (topic, type) => `Write a short ${type} tweet about ${topic} so it can be understood without context. Use less than 280 characters. Don't use hashtags.`;
// Promt for a reply
const replyPrompt = (tweet, type) => `Write a short ${type} reply to a tweet "${tweet}". Use less than 280 characters. Don't use hashtags.`;

;// CONCATENATED MODULE: ./src/inject/inject.ts







const onToolBarAdded = (toolBarEl) => {
    const inputEl = findClosestInput(toolBarEl);
    let prompt = '';
    if (inputEl) {
        addGPTButton(toolBarEl, async (type) => {
            toolBarEl.click();
            const replyToTweet = document.querySelector("article[data-testid=\"tweet\"][tabindex=\"-1\"]");
            if (!!replyToTweet) {
                const textEl = replyToTweet.querySelector("div[data-testid=\"tweetText\"]");
                if (!textEl || !textEl.textContent) {
                    showErrorButton(toolBarEl);
                    return;
                }
                const text = textEl.textContent;
                prompt = replyPrompt(text, type);
            }
            else {
                const trendingResponses = await TwitterClient.getTrending();
                const trendingResponse = trendingResponses[Math.floor(Math.random() * trendingResponses.length)];
                prompt = whatsHappeningPrompt(trendingResponse, type);
            }
            const requestId = inputEl.getAttribute("aria-activedescendant");
            const text = await generateText(requestId, prompt);
            if (text) {
                setInputText(inputEl, text);
            }
            else { // show error
                showErrorButton(toolBarEl);
            }
        });
    }
};
const onToolBarRemoved = (toolBarEl) => { };
// waiting for background events
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message.type) {
        return;
    }
    switch (message.type) {
        case 'partial_tweet':
            const requestId = message.requestId;
            const activeInput = document.querySelector(`div[aria-activedescendant="${requestId}"]`);
            if (activeInput) {
                setInputText(activeInput, message.tweet);
            }
            break;
    }
});
// observe dom tree to detect all tweet inputs once they are created
const toolbarObserver = createObserver("div[data-testid=\"toolBar\"]", onToolBarAdded, onToolBarRemoved);
const reactRoot = document.querySelector("#react-root");
toolbarObserver.observe(reactRoot, { subtree: true, childList: true });

/******/ })()
;