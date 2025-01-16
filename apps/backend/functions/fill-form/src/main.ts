import { GoogleGenerativeAI } from "@google/generative-ai"
import { SchemaType } from "@google/generative-ai/server"
import * as cheerio from "cheerio"

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
        nullable: false,
      },
      value: {
        type: SchemaType.STRING,
        description: "The value to set in the form field",
        nullable: false,
      },
    },
  },
}

export default async function ({ req, res, log, error }: any) {

  if (req.method === "OPTIONS") {
    return res.json("", 200, {
      // * for testing from localhost.
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    })
  }

  if (req.method === "POST") {
    try {
      const cheerioApi = await cheerio.fromURL(req.query.url)

      const inputElements = cheerioApi("form").extract({
        inputElements: [
          { selector: "input, select, textarea, label", value: "outerHTML" },
        ],
      })

      const html = inputElements.inputElements.join("\n")

      const prompt = `Extract structured form data from a resume PDF for a given HTML form. Output JSON with selectors as keys and values as extracted data. Handle radio/checkbox labels, infer gender, default disability/veteran status to "deny" if not specified, and prioritize nearest job location. *Marked fields are required.
      
      ## HTML
      ${html}
      `

      const { resumePdf } = req.bodyJson

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
      const model = genAI.getGenerativeModel({
        model: "models/gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      })

      const { response } = await model.generateContent([
        {
          inlineData: {
            data: resumePdf,
            mimeType: "application/pdf",
          },
        },
        prompt,
      ])

      return res.json(response.text(), 200, {
        "Access-Control-Allow-Origin": "*"
      })

    } catch (err: any) {
      error(err)
      // provide better error handling. you can't just put a 500 for every failed request.
      return res.json(err.message, 500, {
        "Access-Control-Allow-Origin": "*"
      })
    }
  }
}
