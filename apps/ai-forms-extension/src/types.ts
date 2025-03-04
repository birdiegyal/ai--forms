export enum EventType {
  autofillStarted = "autofillStarted",
  formUnderstood = "formUnderstood",
  autofillCompleted = "autofillCompleted",
  autofillFailed = "autofillFailed"
}

export type ClickAction = {
  type: "click"
}

export type FillAction = {
  type: "fill"
  value: string
}

export type FormValues = {
  querySelector: string
  // autofill action to be performed by the content script based on its type.
  action: ClickAction | FillAction
}[]


export type Message = {
  type: "syn" | "ack" | "done" | "scrape"
}

export type AutofillMessage = {
  type: "autofill"
  formValues: FormValues
}

export type ScrapeResultMessage = {
  type: "scrapingResult"
  scrapedHtml: string
}

export type SendResponse<T = any> = (response: T) => void