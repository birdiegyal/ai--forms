"use client"

import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { formField } from "@/app/api/chat/schema"
import { array } from "zod"

export default function () {
  const { stop, isLoading } = useObject({
    api: "/api/chat",
    schema: array(formField)
  })

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex w-2/3 flex-col gap-2.5 p-10">
        <p className="text-xl">
          Generate <b className="capitalize">forms</b> and{" "}
          <b className="capitalize text-orange-400 selection:text-white">
            publish
          </b>{" "}
          them in no time.
          <span className="size-fit italic rounded-3xl border-2 border-orange-500 bg-orange-500/50 px-2 text-xs ml-2">
            beta
          </span>
        </p>
        <PromptInput className="bg-input/20 w-full rounded-2xl border-none p-2">
          <PromptInputTextarea
            placeholder="Describe your Form to hire, for user feedback, a poll with friends..."
            className="dark:bg-input/0 overflow-y-auto p-2"
            isLoading={isLoading}
            stop={stop}
            navigateTo="/session/dummySession"
          />
        </PromptInput>
      </div>
    </div>
  )
}
