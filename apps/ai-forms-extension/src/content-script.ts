import type {
  Message,
  SendResponse,
  FormValues,
  ScrapeResultMessage,
  AutofillMessage
} from "./types"

// start filling forms when you are signalled to do so.
chrome.runtime.onMessage.addListener(
  (
    message: Message | ScrapeResultMessage | AutofillMessage,
    _extensionProcess,
    sendResponse: SendResponse<Message | ScrapeResultMessage | AutofillMessage>
  ) => {
    if (message.type === "syn") {
      sendResponse({
        type: "ack"
      })
    }

    if (message.type === "autofill") {
      autofill(message.formValues)
      sendResponse({
        type: "done"
      })
    }

    if (message.type === "scrape") {
      if (document.readyState === "complete") {
        sendResponse({
          type: "scrapingResult",
          scrapedHtml: scrape()
        })
      }
    }
  }
)

// autofill varies based on the FormValues received.
function autofill(formValues: FormValues) {
  if (formValues.length > 0) {
    for (const { querySelector, action } of formValues) {
      const element = document.querySelector(querySelector) as
        | HTMLInputElement
        | HTMLButtonElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | HTMLLabelElement
      if (element) {
        switch (action.type) {
          case "fill":
            // (element as HTMLInputElement | HTMLTextAreaElement).value = action.value
            element.setAttribute("value", action.value)
            break
          case "click":
            element.click()
            break
          default:
            console.log("unknown action")
        }
      }
    }
  } else {
    console.log("no form values to autofill")
  }
}

function scrape(): string {
  // edit querySelectors when you want to support more job discovery platform.
  const querySelectors = [
    "div#form", //ashbyhq
    "form#application-form" //greenhouse and lever
  ]

  // Go through querySelectors and get the first non-null element
  for (const selector of querySelectors) {
    const element = document.querySelector(selector)
    if (element) {
      return element.outerHTML as string
    }
  }

  // just take away their <body/> if they are such a mess to scrape.
  return document.querySelector("body")?.outerHTML as string
}
