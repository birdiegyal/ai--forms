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

interface PasteLinkFormProps<T extends z.ZodObject<any, any, any, any, any>>
  extends React.HTMLAttributes<HTMLFormElement> {
  formLinkSchema: T
  setFormData: React.Dispatch<z.infer<T>>
  fillForm: (resume: string, url: string) => any
}

export default function PasteLinkForm({
  className,
  setFormData,
  formLinkSchema,
  fillForm,
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
  const form = useForm<z.infer<typeof formLinkSchema>>({
    resolver: zodResolver(formLinkSchema),
  })

  function onSubmit(formData: z.infer<typeof formLinkSchema>) {
    setFormData(formData)

    const req = indexedDB.open(dbConfig.dbName, dbConfig.dbVersion || 1)
    req.onerror = dbConfig.onError
    req.onsuccess = (e) => {
      const db = req.result
      const resumePdfReq = db.transaction(dbConfig.storeName!)
        .objectStore(dbConfig.storeName!)
        .get("userId")
      resumePdfReq.onerror = dbConfig.onError
      resumePdfReq.onsuccess = (e) => {
        fillForm(resumePdfReq.result, formData.link)
      }
    }

    form.reset()
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
                      placeholder="link to your form you want to fill"
                      {...field}
                      className="h-8 border-2"
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
          className="btn btn-secondary focus-visible:ring-secondary h-8"
        >
          Fill out
        </Button>
      </form>
    </Form>
  )
}
