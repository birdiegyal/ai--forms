import { z } from "zod"

export const formField = z.object({
  type: z.enum(["text", "email", "file", "tel", "checkbox"]),
  placeholder: z.string()
}).required()
