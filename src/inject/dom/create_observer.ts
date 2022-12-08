type ElementObserver = (
    selector: string,
    onInputAdded: (el: Element) => void,
    onInputRemoved: (el: Element) => void,
) => MutationObserver;

export const createObserver: ElementObserver = (selector, onInputAdded, onInputRemoved) => {
    return new MutationObserver((mutations_list) => {
      mutations_list.forEach((mutation) => {
          const addedNodes = mutation.addedNodes as unknown as HTMLElement[]; // wrong typings
          addedNodes.forEach((added_node) => {
              if (added_node.querySelector) {
                  const inputEl = added_node.querySelector(selector);
                  if (!!inputEl) {
                    onInputAdded(inputEl);
                  };
              }
          });
  
          const removedNodes = mutation.removedNodes as unknown as HTMLElement[];
          removedNodes.forEach((removed_node) => {
            if (removed_node.querySelector) {
              const inputEl = removed_node.querySelector(selector);
              if (!!inputEl) {
                onInputRemoved(inputEl);
              };
            }
          });
      });
    });
  }
