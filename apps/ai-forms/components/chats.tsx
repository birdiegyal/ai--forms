import FormPreview from "@/components/form-preview"
import { type Message } from "@/app/session/[session_id]/page"
import { Loader } from "@/components/ui/loader"

type ChatProps = {
  messages: Message[]
  isLoading: boolean
}

export default function Chat({ messages, isLoading }: ChatProps) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      {messages.map((message) => {
        switch (message.role) {
          case "user":
            return (
              <div key={message.id} className="max-w-2/3 self-end p-2.5">
                <p className="text-sm">{message.content}</p>
              </div>
            )
          case "assistant":
            return (
              <FormPreview
                className="self-center"
                key={message.id}
                formFields={message.object}
              />
            )
        }
      })}
      {isLoading && (
        <Loader
          variant="text-blink"
          size="sm"
          text="generating form..."
          className="self-start capitalize"
        />
      )}
    </div>
  )
}