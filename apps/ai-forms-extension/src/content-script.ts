import type { Message, SendResponse } from "./types"

// start filling forms when you are signalled to do so.
chrome.runtime.onMessage.addListener(
  (message: Message, _extensionProcess, sendResponse: SendResponse) => {
    if (message.type === "syn") {
      sendResponse({
        type: "ack"
      })
    }

    // checkpoint for a message type.
    if (message.type === "autofill") {
      for (const { querySelector, value } of message.formValues!) {
        const element = document.querySelector(
          querySelector
        ) as HTMLInputElement
        if (element && value) {
          element.value = value
        }
      }

      // send an ack.
      sendResponse({ type: "done" })
    }
  }
)
