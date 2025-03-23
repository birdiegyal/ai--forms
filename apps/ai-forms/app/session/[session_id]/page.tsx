"use client"

import { generateUUID } from "@/lib/utils"
import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input"
import Chat from "@/components/chats"
import {
  experimental_useObject as useObject,
  type Message
} from "@ai-sdk/react"
import { formField } from "@/app/api/chat/schema"
import { z } from "zod"
import { useSearchParams, usePathname } from "next/navigation"
import { useEffect, useReducer } from "react"

export type chatMessage =
  | (Message & {
      object: z.infer<typeof formField>[]
    })
  | Message

type UserAction = {
  role: "user"
  content: string
}

type AssistantAction = {
  role: "assistant"
  object: z.infer<typeof formField>[]
}

export type ActionType = {
  type: "add" | "delete"
  id?: string
} & (UserAction | AssistantAction)

type RoleHandlersType = Partial<{
  [k in chatMessage["role"]]: (
    state: chatMessage[],
    action: ActionType
  ) => chatMessage[]
}>

// type TypeHandlersType = {
//   [k in ActionType["type"]]: (
//     state: Message[],
//     action: ActionType,
//     roleHandler: (state: Message[], action: ActionType) => Message[]
//   ) => Message[]
// }

const roleHandlers: RoleHandlersType = {
  user: (state, action) => {
    if (action.role !== "user") {
      return state
    }
    switch (action.type) {
      case "add":
        return [
          ...state,
          {
            id: action.id || generateUUID(),
            role: "user",
            content: action.content
          }
        ]
      case "delete":
        return state.filter((msg) => msg.id !== action.id)
    }
  },
  assistant: (state, action) => {
    if (action.role !== "assistant") {
      return state
    }
    switch (action.type) {
      case "add":
        return [
          ...state,
          {
            id: action.id || generateUUID(),
            role: "assistant",
            object: action.object,
            content: ""
          }
        ]
      case "delete":
        return state.filter((msg) => msg.id !== action.id)
    }
  }
}

// const typeHandlers: TypeHandlersType = {
//   add(state, action, roleHandler) {
//     return roleHandler(state, action)
//   },
//   delete(state, action, roleHandler) {
//     return roleHandler(state, action)
//   }
// }

function messageDispatcher(state: chatMessage[], action: ActionType) {
  // const typeHandler = typeHandlers[action.type]
  const roleHandler = roleHandlers[action.role]!
  return roleHandler ? roleHandler(state, action) : state
}

export default function () {
  const {
    submit: handleSubmit,
    stop,
    isLoading
  } = useObject({
    api: "/api/chat",
    schema: z.array(formField),
    onFinish({ object }) {
      if (object) {
        dispatch({
          type: "add",
          role: "assistant",
          object: object
        })
      }
    }
  })

  const searchParams = useSearchParams()
  const currentPath = usePathname()
  const prompt = searchParams.get("prompt")
  const [messages, dispatch] = useReducer(
    messageDispatcher,
    prompt
      ? [
          {
            role: "user",
            content: prompt,
            id: generateUUID()
          }
        ]
      : []
  )

  // one request is made in here.
  useEffect(() => {
    console.count("# of times this effect runs")
    if (prompt) {
      handleSubmit(prompt)
      window.history.replaceState({}, "", currentPath)
    }
  }, [])

  return (
    <>
      <div className="flex w-full grow items-center justify-center pb-[300px] pt-16">
        <div className="px-15 flex w-full flex-col justify-start gap-2.5 lg:max-w-[85%]">
          <Chat messages={messages} isLoading={isLoading}></Chat>
        </div>
      </div>
      <PromptInput
        className="bg-input/20 fixed inset-x-0 bottom-4 z-40 mx-auto w-full max-w-3xl rounded-2xl border-none backdrop-blur-2xl"
        onSubmit={handleSubmit}
      >
        <PromptInputTextarea
          placeholder="Describe your Form for hiring a Design Engineer..."
          className="dark:bg-input/0 overflow-y-auto p-2"
          isLoading={isLoading}
          stop={stop}
          dispatch={dispatch}
        />
      </PromptInput>
    </>
  )
}

/* 
TODO
*/
