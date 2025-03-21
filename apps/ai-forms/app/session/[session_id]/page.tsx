"use client"

import FormPreview from "@/components/form-preview"
import {
  PromptInput,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { formField } from "@/app/api/chat/schema"
import { array } from "zod"

export default function () {
  const {
    submit: handleSubmit,
    object: formFields,
    stop,
    isLoading
  } = useObject({
    api: "/api/chat",
    schema: array(formField)
  })

  if (formFields) {
    console.log(formFields)
  }

  return (
    <div className="flex h-full w-full grow items-center justify-center">
      <div className="relative flex h-full w-full flex-col justify-start gap-2.5 px-10">
        {/* <FormPreview></FormPreview> */}
        <PromptInput
          className="bg-input/20 absolute inset-x-0 bottom-0 z-40 mx-auto w-full max-w-3xl rounded-2xl border-none p-2 backdrop-blur-2xl"
          onSubmit={handleSubmit}
        >
          <PromptInputTextarea
            placeholder="Describe your Form for hiring a Design Engineer..."
            className="dark:bg-input/0 overflow-y-auto p-2"
            isLoading={isLoading}
            stop={stop}
          />
        </PromptInput>
      </div>
    </div>
  )
}

/* 
TODO
  - we need a way to send the prompt to the /api/chat.
  - 
*/
