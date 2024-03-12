// can be more optimised, but ¯\_(ツ)_/¯, typically common container is just 2-3 levels higher
export const findClosestInput: (el: Element) => HTMLElement | null = (el) => {
    // Adjust the selector to target the contenteditable div
    const contentEditableEl = el.querySelector("div[data-testid^='tweetTextarea_'][contenteditable='true']") as HTMLElement;
    if (contentEditableEl) {
        return contentEditableEl;
    }

    // Recurse up the DOM tree if the element is not found
    if (!el.parentElement) {
        return null;
    } else {
        return findClosestInput(el.parentElement);
    }
};