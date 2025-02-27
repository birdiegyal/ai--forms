import * as cheerio from "npm:cheerio"

export default async function getAllInputFields(urlToAutofill: string) {
  const cheerioApi = await cheerio.fromURL(urlToAutofill)
  const inputElements = cheerioApi("body").extract({
    inputElements: [
      { selector: "input, select, textarea, label", value: "outerHTML" },
    ],
  })
  const html = inputElements.inputElements.join("\n")
  return html
}

