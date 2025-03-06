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

function autofill(formValues: FormValues) {
  if (formValues.length > 0) {
    const visited: Element[] = []
    const clickables = formValues.filter(
      (formValue) => formValue.action.type === "click"
    )

    for (const { querySelector } of clickables) {
      const elements = document.querySelectorAll(querySelector) as NodeListOf<HTMLButtonElement | HTMLLabelElement>

      for (const element of elements) {
        if (!visited.includes(element)) {
          visited.push(element)
          element.click()
          element.blur()
        }
      }
    }

    // this should make action.type = FillAction. weak type system ig.
    const fillables = formValues.filter(
      (formValue) => formValue.action.type === "fill"
    )

    // this is a weird workaround especially for ashbyhq.
    setTimeout(() => {
      for (const { querySelector, action } of fillables) {
        const element = document.querySelector(querySelector) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement
          | HTMLLabelElement

        if (element && action.type === "fill") {
          element.focus()
          ;(element as HTMLTextAreaElement | HTMLInputElement).value =
            action.value
          element.blur()
        }
      }
    }, 1000)

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


/* 
we got a new problem here. after filling the form, the form is not submitted. very PROBLEMATIC.
*/