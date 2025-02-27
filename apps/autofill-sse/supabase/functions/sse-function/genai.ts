import { Buffer } from "node:buffer"
import { GoogleGenerativeAI } from "npm:@google/generative-ai"
import { type Part, SchemaType } from "npm:@google/generative-ai/server"

const schema = {
  description: "structured output of the form fields filled by AI",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    required: ["querySelector", "value"],
    properties: {
      querySelector: {
        type: SchemaType.STRING,
        description: "The query selector of the form field",
        nullable: false
      },
      value: {
        type: SchemaType.STRING,
        description: "The value to set in the form field",
        nullable: false
      }
    }
  }
}

export default async function generateFormValues({
  prompt,
  files
}: {
  prompt: string
  files: File[]
  htmlContent: string
}) {
  const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") as string)

  const model = genAI.getGenerativeModel({
    model: "models/gemini-1.5-flash",
    systemInstruction: `
    You are an AI form filler who parses the information from user uploaded files like pdfs and images. 

    Procedure:
    You will get the form's html content in the Prompt that you have to parse and understand what values to extract from the user's files and return a structured output as specified in the given schema. 

    Rules to follow strictly:
    > Infer form fields like gender, disability, nationality based on user's info present in the uploaded files. 
    > For fields like cover letter you have to carefully generate humanly text based on the user info provided in the uploaded files. no further human supervision or input should be required.
    > Always fill the required fields marked by * and dont fill the field if the required context isn't provided in the user's files.
    > wrap the attribute names of a query selector in single quotes. e.g. "input[name='firstname']", "select[name='opportunityLocationId'], "textarea[name='coverLetter']".
    > Don't try to autofill the fields of type="file".
    `,
    generationConfig: {
      responseSchema: schema,
      responseMimeType: "application/json",
      temperature: 0.2
    }
  })

  const inlineDataFiles: Part[] = []
  for (const file of files) {
    inlineDataFiles.push({
      inlineData: {
        data: Buffer.from(await file.arrayBuffer()).toString("base64"),
        mimeType: file.type
      }
    })
  }

  // we need to support generateContentStream after this.
  const { response } = await model.generateContent([prompt, ...inlineDataFiles])

  return response.text()
}
