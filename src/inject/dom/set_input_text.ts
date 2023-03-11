import { wait } from "../../utils/wait";

export const setInputText = async (inputEl: HTMLInputElement, text: string) => {
    const textWrapper = inputEl.querySelector('[data-text="true"]')?.parentElement;
    if (textWrapper) {
        textWrapper.innerHTML = `<span data-text="true">${text}</span>`;
        textWrapper.dispatchEvent(new Event('input', { 'bubbles': true, 'cancelable': true }));
    }
};