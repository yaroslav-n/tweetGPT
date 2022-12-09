import { wait } from "../../utils/wait";

export const setInputText = async (inputEl: Element, text: string) => {
    (inputEl as any).focus();
    await wait(1);
    try { document.execCommand('selectAll'); } catch(e) {}
    try { document.execCommand('insertHTML', false, text); } catch(e) {}
};