import { wait } from "../../utils/wait";

export const setInputText = async (inputEl: HTMLInputElement, text: string) => {
    const textWrapper = inputEl.querySelector('[data-text="true"]')?.parentElement;
    const elements = document.getElementsByClassName("public-DraftEditorPlaceholder-root");
    const parentNode = elements[0].parentNode;
    if (parentNode) {
      parentNode.removeChild(elements[0]);
    }
    if (textWrapper) {
        textWrapper.innerHTML = `<span data-text="true">${text}</span>`;
        textWrapper.dispatchEvent(new Event('input', { 'bubbles': true, 'cancelable': true }));
    }
};