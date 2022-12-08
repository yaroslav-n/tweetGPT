import { wait } from "../../utils/wait";

let debounceTimeout: NodeJS.Timeout | undefined;
let savedText = '';

// debounce helps with some bugs around text selection
export const setInputTextWithDebounce = async (inputEl: Element, text: string, debounceMs: number) => {
  savedText = text;
  if (!debounceTimeout) {
    debounceTimeout = setTimeout(() => {
      setInputText(inputEl, savedText);
      debounceTimeout = undefined;
    }, debounceMs);
    setInputText(inputEl, text);
  }
};


export const setInputText = async (inputEl: Element, text: string) => {
    (inputEl as any).focus();
    try { document.execCommand('selectAll'); } catch(e) {}
    try { document.execCommand('insertHTML', false, `<span data-text="true">${text}</span>`); } catch(e) {}
};