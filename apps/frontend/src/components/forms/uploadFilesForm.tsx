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
import React from "react"
import { dbConfig } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useNavigate } from "@tanstack/react-router"

interface UploadFilesFormProps extends React.HTMLAttributes<HTMLFormElement> {}

const uploadFilesSchema = z.object({
  files: z.instanceof(FileList),
})

export default function UploadFilesForm({ className }: UploadFilesFormProps) {
  const form = useForm<z.infer<typeof uploadFilesSchema>>({
    resolver: zodResolver(uploadFilesSchema),
    mode: "onChange",
  })
  const { toast, dismiss } = useToast()
  const navigate = useNavigate()

  function onSubmit(formData: z.infer<typeof uploadFilesSchema>) {
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
          // console.log("file uploaded.", e)
          toast({
            title: "File uploaded.",
            action: (
              <ToastAction
                altText="autofill forms"
                onClick={(e) => {
                  e.preventDefault()
                  navigate({
                    to: "/fillforms",
                  })
                  dismiss()
                }}
              >
                Autofill Forms
              </ToastAction>
            ),
          })
        }
        // you may want to add a retry mechanism in here.
        addReq.onerror = dbConfig.onError
      }
    }
    form.reset()
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
          className="btn btn-secondary focus-visible:ring-secondary h-8"
        >
          Upload
        </Button>
      </form>
    </Form>
  )
}
