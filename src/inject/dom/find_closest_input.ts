// can be more optimised, but ¯\_(ツ)_/¯, typically common container is just 2-3 levels higher
export const findClosestInput: (el: Element) => HTMLInputElement | null = (el) => {
    const inputEl = el.querySelector("div[data-testid^=\"tweetTextarea_\"][role=\"textbox\"]") as HTMLInputElement;
    if (inputEl) {
        return inputEl;
    }

    if (!el.parentElement) {
        return null;
    } else {
        return findClosestInput(el.parentElement);
    }
}
