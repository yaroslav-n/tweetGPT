export const setInputText = async (el: any, text: string) => {
  const dataTransfer = new DataTransfer();

  // this may be 'text/html' if it's required
  dataTransfer.setData("text/plain", text);

  el.dispatchEvent(
    new ClipboardEvent("paste", {
      clipboardData: dataTransfer,

      // need these for the event to reach Draft paste handler
      bubbles: true,
      cancelable: true,
    })
  );

  // clear DataTransfer Data
  dataTransfer.clearData();
};
