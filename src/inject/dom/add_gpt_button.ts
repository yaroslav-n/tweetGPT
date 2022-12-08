import { wait } from "../../utils/wait";

const gptIconSrc = chrome.runtime.getURL("icons/button.svg");
const gptIconErrorSrc = chrome.runtime.getURL("icons/button_error.svg");

export const addGPTButton = (toolbarEl: Element, onClick: () => Promise<void>) => {
    const buttonContainer = toolbarEl.children[0]; // doesn't have it's own readable class / testId
    
    // create icon component
    const gptIconSrc = chrome.runtime.getURL("icons/button.svg");
    const gptIcon = document.createElement('img');
    gptIcon.classList.add("gptIcon");
    gptIcon.setAttribute("src", gptIconSrc);

    // create icon wrapper
    const gptIconWrapper = document.createElement('div');
    gptIconWrapper.classList.add("gptIconWrapper");
    gptIconWrapper.appendChild(gptIcon);
    gptIconWrapper.onclick = async () => {
        gptIconWrapper.classList.add("loading");
        await onClick();
        gptIconWrapper.classList.remove("loading");
    }

    // attach to container
    buttonContainer.appendChild(gptIconWrapper);
}

export const showErrorButton = async (toolbarEl: Element) => {
    const gptIcon = toolbarEl.querySelector(".gptIcon");
    if (gptIcon) {
        gptIcon.setAttribute("src", gptIconErrorSrc);
        gptIcon.classList.add("error");
    }
    await wait(5000);
    gptIcon?.setAttribute("src", gptIconSrc);
    gptIcon?.classList.remove("error");
}