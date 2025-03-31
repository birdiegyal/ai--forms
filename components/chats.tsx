import { redirect } from "next/navigation"
import { publishForm } from "@/app/actions"
import FormPreview from "@/components/form-preview"
import { type ChatProps } from "@/lib/types"
import { Loader } from "@/components/ui/loader"
import clsx from "clsx"
import { Button } from "./ui/button"
import { Expand, BookCheck } from "lucide-react"
import { toast } from "sonner"

export default function Chat({
  messages,
  isLoading,
  className: _className,
}: ChatProps) {

  
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
                <div className={clsx("w-full", _className)} key={message.id}>
                  <div className="bg-secondary/50 flex w-full items-center justify-between rounded-t-sm p-2.5">
                    <p className="capitalize">form preview</p>
                    <div className="flex items-center justify-center gap-2.5">
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        className="cursor-pointer"
                      >
                        <Expand className="size-6 p-1" />
                      </Button>
                      {/* we need a way to feedback to the user. */}
                      <Button
                        variant="ghost"
                        className="cursor-pointer rounded-md text-sm "
                        onClick={async (e) => {
                          e.preventDefault()
                          try {
                            const res = await publishForm(message.object)
                            if (res) {
                              const publishedFormUrl = `/forms/${res.formId}`
                              toast("Form published successfully", {
                                action: {
                                  label: "view",
                                  onClick: () => {
                                    redirect(publishedFormUrl)
                                  },
                                },
                              })
                            }
                          } catch (e) {
                            console.error(e)
                          }
                        }}
                      >
                        <BookCheck className="size-6 p-1" />
                        <p className="capitalize">publish</p>
                      </Button>
                    </div>
                  </div>
                  <FormPreview
                    className="self-center"
                    key={message.id}
                    formFields={message.object}
                  />
                </div>
              )
            }
        }
      })}
      {isLoading && (
        <Loader
          variant="text-shimmer"
          size="sm"
          text="generating form..."
          className="self-start capitalize"
        />
      )}
    </div>
  )
}
