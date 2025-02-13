// import { DevTool } from "@hookform/devtools"
import { DragDrop } from "@/components/custom/dragdrop"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { dbConfig } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useNavigate } from "@tanstack/react-router"
import { LoaderCircle, SquareMousePointer } from "lucide-react"

interface UploadFilesFormProps extends React.HTMLAttributes<HTMLFormElement> {}

const uploadFilesSchema = z.object({
  files: z.instanceof(FileList),
})

export default function UploadFilesForm({ className }: UploadFilesFormProps) {
  const form = useForm<z.infer<typeof uploadFilesSchema>>({
    resolver: zodResolver(uploadFilesSchema),
    mode: "onTouched",
    defaultValues: {
      files: undefined,
    },
  })
  const { toast, dismiss } = useToast()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)

  function onSubmit(formData: z.infer<typeof uploadFilesSchema>) {
    setIsPending(true)

    try {
      const resumeFile = formData.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(resumeFile)

      reader.onload = () => {
        const dataURL = reader.result as string
        const base64ResumeFile = dataURL.split(",")[1]
        const req = indexedDB.open(dbConfig.dbName, dbConfig.dbVersion! || 1)
        req.onerror = dbConfig.onError
        req.onupgradeneeded = dbConfig.onUpgradeNeeded!
        req.onsuccess = (e) => {
          e.preventDefault()
          const db = req.result
          const addReq = db
            .transaction(dbConfig.storeName!, "readwrite")
            .objectStore(dbConfig.storeName!)
            .add(base64ResumeFile, "userId")
          addReq.onsuccess = (e) => {
            toast({
              className:
                "bg-primary text-primary-foreground stroke-primary-foreground ",
              title: "File uploaded.",
              action: (
                <ToastAction
                  className="hover:bg-primary toast-action-btn focus:ring-primary-foreground flex h-8 items-center gap-1 border-0 ring-offset-0"
                  altText="autofill forms"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate({
                      to: "/fillforms",
                    })
                    dismiss()
                  }}
                >
                  <SquareMousePointer className="stroke-2" size={18} />
                  <p>Autofill Forms</p>
                </ToastAction>
              ),
            })
          }
          // you may want to add a retry mechanism in here.
          addReq.onerror = (e) => {
            e.preventDefault()
            if (addReq.error?.name === "ConstraintError") {
              toast({
                className: "bg-destructive text-destructive-foreground",
                title: "File not uploaded.",
                description:
                  "a file is already uploaded and we dont support multi file uploads right now.",
              })
            }
          }
        }
      }
    } catch (error) {
      console.error(error)
      toast({
        className: "capitalize bg-destruction text-destruction-foreground",
        title: "file not uploaded",
      })
    } finally {
      form.reset({
        files: undefined,
      })
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <FormField
          name="files"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <DragDrop {...field} />
                </FormControl>
                <FormDescription className="mt-1 text-xs">
                  drag files from your device and drop them here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        ></FormField>
        <Button
          type="submit"
          variant={"secondary"}
          className="btn-secondary btn focus-visible:ring-secondary flex h-10 rounded-xl justify-center font-bold capitalize transition"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin justify-self-end stroke-2" />
              <p className="justify-self-start">uploading...</p>
            </>
          ) : (
            <>
              <p>upload</p>
            </>
          )}
        </Button>
      </form>
      {/* <DevTool control={form.control} /> */}
    </Form>
  )
}
