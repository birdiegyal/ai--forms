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

    e.g.
    <user>: create a form asking the job applicant his fullname, phone number, email, and proof of excellence in any field. ask him about his expectations from our company.
    
    <assisant>: [{"type": "text", "placeholder": "fullname"},   {"type": "email", "placeholder": "email"}, {"type": "tel", "placeholder": "phone number"}, {"type": "text", "placeholder": "proof of excellence"}, {"type": "text", "placeholder": "your  expectations from our company"}]`,
    prompt,
    model: google("gemini-2.0-flash-lite-preview-02-05"),
    schema: formField
    // headers: {
    //   'Connection': 'keep-alive',
    //   'Keep-Alive': 'timeout=30'
    // },
  })

  return result.toTextStreamResponse()
}
