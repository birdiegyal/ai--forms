import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import generateFormValues from "./genai.ts"
import { corsHeaders } from "../_shared/cors.ts"

// type IFormdata = {
//   HTML: string
//   uploadFiles: File[]
//   additionalContext: string
// }

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const textEncoder = new TextEncoder()

  // this should adhere to IFormdata.
  const formData = await req.formData()

  const files = formData.getAll("uploadFiles") as File[]
  const additionalContext = formData.get("additionalContext") as string
  const HTML = formData.get("HTML") as string

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // notify user about scraping completed or failed.
        controller.enqueue(
          textEncoder.encode(`event: formUnderstood\ndata: ""\n`)
        )

        const prompt = `fill this form for me. HTML: ${HTML} ${additionalContext !== "" && `ADDITIONAL CONTEXT: ${additionalContext}`}`

        const formValues = await generateFormValues({
          prompt,
          files
        })

        // notify user about autofill completed or failed.
        controller.enqueue(
          textEncoder.encode(
            `event: autofillCompleted\ndata: ${JSON.stringify({ formValues })}\n`
          )
        )
      } catch (error) {
        console.error(error)
        textEncoder.encode(
          `event: autofillFailed\ndata:""\n`
        )
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Access-Control-Allow-Origin": "*"
    }
  })
})
