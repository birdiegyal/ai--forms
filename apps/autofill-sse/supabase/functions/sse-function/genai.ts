import { Buffer } from "node:buffer"
import { GoogleGenerativeAI } from "npm:@google/generative-ai"
import { type Part, SchemaType } from "npm:@google/generative-ai/server"

const schema = {
  description: "structured output of the form fields filled by AI",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    required: ["querySelector", "action"],
    properties: {
      querySelector: {
        type: SchemaType.STRING,
        description: "The query selector of the form field",
        nullable: false
      },
      action: {
        type: SchemaType.OBJECT,
        description:
          "The action to be performed in order to set the form field",
        properties: {
          type: {
            type: SchemaType.STRING,
            description:
              "The type of action to be performed. it could be either a click or fill",
            nullable: false
          },
          value: {
            type: SchemaType.STRING,
            description:
              "The value to be set in the form field only if the action type is fill",
            nullable: true
          }
        },
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
}) {
  const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") as string)

  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.0-flash",
    systemInstruction: `GOAL: extract required information to fill the form using user uploaded pdfs and images. 
    
    RESPONSE: structured response schema provided.
    
    WARNINGS: 
    1. don't try to set the field of following type: input elements of type file 
    2. when trying to answer checkboxes always return queryselector of the label describing it. 
    3. always use single quotes within queryselectors. e.g. "input[type='name']", "label[for='abaf1ba5-6c68-410d-b083-72ebd3301d0e_question_16851360002[]-labeled-checkbox-0']"
    4. infer gender, race, veteran status based on user information provided.
    
    CONTEXT: you are recieving HTML required to understand what is asked in the form and user files in pdf and images format to answer the questions asked in the form. you may receive the writing style to adopt by the user and some additional user infomation in the prompt that is to be included while answering the form questions. 
    
    for e.g. i've total 3 years of working experience for Jio Cinema with CTC of 45 LPA. I expect CTC of 65LPA for the current Job role and Banglore is my preffered Job location. 
    
    so you have to extrapolate from the information provided by user in the prompt in the form answers as well.`,

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
