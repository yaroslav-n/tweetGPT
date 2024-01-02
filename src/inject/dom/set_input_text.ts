import { wait } from "../../utils/wait";

export const setInputText = async (inputEl: HTMLInputElement, text: string) => {
    const textWrapper = inputEl.querySelector('[data-text="true"]')?.parentElement;
    const elements = document.getElementsByClassName("public-DraftEditorPlaceholder-root");
    for (const element of elements) {
      const parentNode = element.parentNode;
      if (parentNode) {
        parentNode.removeChild(element);
      }
    }
    if (textWrapper) {
        textWrapper.innerHTML = `<span data-text="true">${text}</span>`;
        textWrapper.dispatchEvent(new Event('input', { 'bubbles': true, 'cancelable': true }));
    }
};