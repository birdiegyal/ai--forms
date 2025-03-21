"use client"

import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { formField } from "@/app/api/chat/schema"
import { array } from "zod"

export default function Home() {
  const {
    submit: handleSubmit,
    object: formFields,
    stop,
    isLoading
  } = useObject({
    api: "/api/chat",
    schema: array(formField)
  })

  return (
    <div className="flex w-full grow flex-col items-center justify-center">
      <div className="flex w-2/3 flex-col justify-start gap-2.5 p-10">
        <p className="text-xl">
          Generate <b className="capitalize">forms</b> and{" "}
          <b className="capitalize text-orange-400 selection:text-white">publish</b> them in no time.
        </p>
        <PromptInput className="bg-input/20 w-full rounded-2xl border-none p-2"
        onSubmit={(value: string) => {
          /* 
          TODO
           - create a new session.
           - navigate to it.
           - call handleSubmit(value).
          */
        }}
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
