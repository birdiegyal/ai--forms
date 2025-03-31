import { z } from "zod"
import { type Message } from "@ai-sdk/react"
import { formField } from "@/app/api/chat/schema"

export type formSchemaType = z.infer<typeof formField>[]

export type chatMessage =
  | (Message & {
      object: formSchemaType
    })
  | Message

export type ChatProps = {
  messages: chatMessage[]
  isLoading: boolean
} & React.HTMLAttributes<HTMLDivElement>

export type UserAction = {
  role: "user"
  content: string
}

export type AssistantAction = {
  role: "assistant"
  object: formSchemaType
}

export type ActionType = {
  type: "add" | "delete"
  id?: string
} & (UserAction | AssistantAction)

export type RoleHandlersType = Partial<{
  [k in chatMessage["role"]]: (
    state: chatMessage[],
    action: ActionType
  ) => chatMessage[]
}>

