import { wait } from "../../utils/wait";

export const setInputText = async (inputEl: HTMLInputElement, text: string) => {
    inputEl.focus();
    await wait(1);
    try { document.execCommand('selectAll'); } catch(e) {}
    try { document.execCommand('insertText', false, text); } catch(e) {}
};