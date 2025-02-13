import { LoaderCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { cn } from "@/lib/utils"
import { dbConfig } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Columns2 } from "lucide-react"
import { type ImperativePanelGroupHandle } from "react-resizable-panels"

interface PasteLinkFormProps<T extends z.ZodObject<any, any, any, any, any>>
  extends React.HTMLAttributes<HTMLFormElement> {
  formLinkSchema: T
  setFormData: React.Dispatch<z.infer<T>>
  fillForm: (resume: string, url: string) => any
  isFillingForm: boolean
  panelGroupRef: React.RefObject<ImperativePanelGroupHandle | null>
}

export default function PasteLinkForm({
  className,
  setFormData,
  formLinkSchema,
  fillForm,
  isFillingForm,
  panelGroupRef,
}: PasteLinkFormProps<
  z.ZodObject<
    {
      link: z.ZodString
    },
    "strip",
    z.ZodTypeAny,
    {
      link: string
    },
    {
      link: string
    }
  >
>) {
  const { dismiss, toast } = useToast()
  const form = useForm<z.infer<typeof formLinkSchema>>({
    resolver: zodResolver(formLinkSchema),
  })

  // don't submit unless you've got the user is logged in or atleast a guest.
  function onSubmit(formData: z.infer<typeof formLinkSchema>) {
    setFormData(formData)
    const panelGroup = panelGroupRef.current

    try {
      const req = indexedDB.open(dbConfig.dbName, dbConfig.dbVersion || 1)
      req.onerror = dbConfig.onError
      req.onsuccess = (e) => {
        const db = req.result
        const resumePdfReq = db
          .transaction(dbConfig.storeName!)
          .objectStore(dbConfig.storeName!)
          // replace userId with the unique userId/user.
          .get("userId")

        resumePdfReq.onerror = dbConfig.onError
        // resumePdfReq.onsuccess = async () => {
        //   const res = await fillForm(resumePdfReq.result, formData.link)

        //   if (res !== undefined) {
        //     toast({
        //       title: "Form autofilled",
        //       description: "checkout the autofilled values in the preview",
        //       className: "bg-primary text-primary-foreground",
        //       action: (
        //         <ToastAction
        //           altText="show preview"
        //           className="hover:bg-primary toast-action-btn focus:ring-primary-foreground flex h-8 items-center gap-1 border-0 ring-offset-0"
        //           onClick={(e) => {
        //             e.preventDefault()
        //             e.stopPropagation()

        //             if (panelGroup !== null) {
        //               panelGroup.setLayout([50, 50])
        //             }

        //             form.reset({
        //               link: "",
        //             })

        //             dismiss()
        //           }}
        //         >
        //           <Columns2 className="stroke-2" size={18} />
        //           <p>show preview</p>
        //         </ToastAction>
        //       ),
        //     }
        //   )
        //   } else {
        //     toast({
        //       title: "Couldn't autofill your form",
        //       className: "bg-destructive text-destructive-foreground",
        //     })
        //   }
        // }
      }
    } catch (error) {
      console.error(error)
    } finally {
      if (panelGroup !== null) {
        const currentLayout = panelGroup.getLayout()
        if (currentLayout[0] === 50 && currentLayout[1] === 50) {
          // panelGroup.setLayout([0, 100])
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("relative flex flex-col gap-5", className)}
      >
        <FormField
          name="link"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-5">
                    <h1 className="font-display text-4xl">Paste form link</h1>
                    <Input
                      type="url"
                      placeholder="link of your form that you want to autofill"
                      {...field}
                      className="border-border text-input h-10 rounded-xl border"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        ></FormField>
        <Button
          type="submit"
          variant={"secondary"}
          className="btn btn-secondary focus-visible:ring-secondary flex h-10 justify-center rounded-xl capitalize"
          disabled={isFillingForm}
        >
          {isFillingForm ? (
            <>
              <LoaderCircle className="animate-spin justify-self-end stroke-2" />
              <p className="justify-self-start">autofilling your form...</p>
            </>
          ) : (
            <>
              <p className="">autofill</p>
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
