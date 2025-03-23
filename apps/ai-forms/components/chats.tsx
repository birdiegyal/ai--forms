import FormPreview from "@/components/form-preview"
import { type chatMessage } from "@/app/session/[session_id]/page"
import { Loader } from "@/components/ui/loader"

type ChatProps = {
  messages: chatMessage[]
  isLoading: boolean
}

const msg: chatMessage = {
  object: [
    {
      name: "xyz",
      placeholder: "xyz",
      type: "text"
    }
  ],
  role: "assistant",
  id: "1",
  content: ""
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
            if ("object" in message) {
              return (
                <FormPreview
                  className="self-center"
                  key={message.id}
                  formFields={message.object}
                />
              )
            }
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
