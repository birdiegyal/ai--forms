import { z } from "zod"

export const formField = z
  .object({
    type: z
      .enum(["text", "email", "file", "tel", "checkbox", "url"])
      .describe("used to set the form fields type attribute"),
    placeholder: z
      .string()
      .describe("used to provide a intuition to users about the form field."),
    name: z.string().describe("used to set the name in the FormData api")
  })
  .required()
  .describe("this structured output is used to render a form to user.")
