import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"
import { formField } from "@/app/api/chat/schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getZodSchemaFromStructuredOutput(
  structuredOutput: z.infer<typeof formField>[]
) {
  const schema: Record<string, any> = {}

  for (let field of structuredOutput) {
    switch (field.type) {
      case "text":
        schema[field.name] = z.string({
          required_error: "this field is required"
        }).min(1, {message: "this field is required"})
        break

      case "email":
        schema[field.name] = z.string().email({
          message: "enter a valid email address"
        })
        break
      case "checkbox":
        schema[field.name] = z.boolean()
        break
      case "file":
        schema[field.name] = z.instanceof(File, {
          message: "please select an appropriate file"
        })
        break
      case "tel":
        // add the refine regex for validating the phno further.
        schema[field.name] = z
          .string()
          .min(10, { message: "enter a valid phone number" })
        break
    }
  }

  return z.object(schema)
}

export function getZeroValues(structuredOutput: z.infer<typeof formField>[]) {
  const zeroValues: Record<string, any> = {}
  for (let field of structuredOutput) {
    switch (field.type) {
      case "text":
        zeroValues[field.name] = ""
      case "email":
        zeroValues[field.name] = ""
      case "checkbox":
        zeroValues[field.name] = false
      case "file":
        zeroValues[field.name] = null
      case "tel":
        zeroValues[field.name] = ""
    }
  }
  return zeroValues
}


/* 
we have to support more and more field types progressively.
*/