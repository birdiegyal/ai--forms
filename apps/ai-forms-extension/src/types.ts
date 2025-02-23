export enum EventType {
  autofillStarted = "autofillStarted",
  formUnderstood = "formUnderstood",
  autofillCompleted = "autofillCompleted"
}
export type FormValues = {
  querySelector: string
  value: string
}[]

export type Message = {
  type: string
  formValues?: FormValues
}

export type SendResponse = (response: Message) => void

