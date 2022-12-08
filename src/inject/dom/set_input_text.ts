import { wait } from "../../utils/wait";

let debounceTimeout: NodeJS.Timeout | undefined;
let savedText = '';

// debounce helps with some bugs around text selection
export const setInputTextWithDebounce = async (inputEl: Element, text: string, debounceMs: number) => {
  savedText = text;
  if (!debounceTimeout) {
    setInputText(inputEl, text);
    debounceTimeout = setTimeout(() => {
      setInputText(inputEl, savedText);
      debounceTimeout = undefined;
    }, debounceMs);
  }
};


export const setInputText = async (inputEl: Element, text: string) => {
    (inputEl as any).focus();
    await wait(1);
    try { document.execCommand('selectAll'); } catch(e) {}
    try { document.execCommand('insertHTML', false, text); } catch(e) {}
};