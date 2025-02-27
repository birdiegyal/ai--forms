// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import generateFormValues from "./genai.ts"
import getAllInputFields from "./scrapper.ts"
import { corsHeaders } from "../_shared/cors.ts"

// type IFormdata = {
//   urlToAutofill: string
//   uploadFiles: File[]
//   customInstructions: string
// }

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const textEncoder = new TextEncoder()

  // this should adhere to IFormdata.
  const formData = await req.formData()

  // this is going to be [] if no files are uploaded. we need to make sure that user gets the feedback that he hasn't selected a file and uploaded yet and is trying to autofill which is impossible to do.
  const files = formData.getAll("uploadFiles") as File[]
  const customInstructions = formData.get("customInstructions") as string
  const urlToAutofill = formData.get("urlToAutofill") as string

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // notify user about autofilling has started.
        controller.enqueue(
          textEncoder.encode(
            `event: autofillStarted\ndata: ""\n`,
          ),
        )

        const htmlContent = await getAllInputFields(urlToAutofill)

        // notify user about scraping completed or failed.
        controller.enqueue(
          textEncoder.encode(
            `event: formUnderstood\ndata: ""\n`,
          ),
        )

        const prompt =
          `fill this form using html content required to understand the form.
        HTML CONTENT: ${htmlContent}
        ${
            customInstructions !== "" &&
            `CUSTOM INSTRUCTIONS: ${customInstructions}`
          }
        `
        const formValues = await generateFormValues({
          prompt,
          files,
          htmlContent,
        })

        // notify user about autofill completed or failed.
        controller.enqueue(
          textEncoder.encode(
            `event: autofillCompleted\ndata: ${JSON.stringify({ formValues })}\n`,
          ),
        )
        
      } catch (error) {
        console.error(error)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(
    stream,
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Access-Control-Allow-Origin": "*",
      },
    },
  )
})

/*
 To invoke locally:
  curl -X POST 'http://127.0.0.1:54321/functions/v1/sse-function' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
*/
