import { google } from "@ai-sdk/google"
import { streamObject } from "ai"
import { formField } from "@/app/api/chat/schema"

// Allow streaming responses up to 30 seconds. but this will only take effect in the prod env.
export const maxDuration = 30

export async function POST(req: Request) {
  const prompt: string = await req.json()

  const result = streamObject({
    system: `you are a form generator that generates a structured output in json format and supplied schema by understanding user prompt.

    warnings:
    > strings should be in lowercase.
    > use directed speech
    > use appropriate field types for the formFields. e.g. if the answer could be simple yes or no, use a checkbox. if it could be answered using a number, then use a number.
    > return intuitive field names and use spaces instead of underscores for separation.

    e.g.
    <user>: create a form asking the job applicant his fullname, phone number, email, and proof of excellence in any field. ask him about his salary expectations to work at our company.
    
    <assisant>: [{"type": "text", "placeholder": "your fullname", "name": "fullname"},   {"type": "email", "placeholder": "your email", "name": "email"}, {"type": "tel", "placeholder": "your phone number", "name": "phone number"}, {"type": "text", "placeholder": "proof of excellence", "name": "proof of excellence"}, {"type": "number", "placeholder": "your salary expectations to work at our company", "name": "salary expectations"}]`,
    prompt,
    model: google("gemini-2.0-flash-lite-preview-02-05"),
    schema: formField,
    output: "array"
  })

  return result.toTextStreamResponse()
}
