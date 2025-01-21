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
import { toast } from "@/hooks/use-toast"

interface PasteLinkFormProps<T extends z.ZodObject<any, any, any, any, any>>
  extends React.HTMLAttributes<HTMLFormElement> {
  formLinkSchema: T
  setFormData: React.Dispatch<z.infer<T>>
  fillForm: (resume: string, url: string) => any
  isFillingForm: boolean
}

export default function PasteLinkForm({
  className,
  setFormData,
  formLinkSchema,
  fillForm,
  isFillingForm,
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

  // don't submit unless you've got the user is logged in or atleast a guest.
  function onSubmit(formData: z.infer<typeof formLinkSchema>) {
    setFormData(formData)

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
        resumePdfReq.onsuccess = async (e) => {
          const res = await fillForm(resumePdfReq.result, formData.link)

          if (res !== undefined) {
            toast({
              title: "Form autofilled",
              className: "bg-primary text-primary-foreground",
            })
          } else {
            toast({
              title: "Couldn't autofill your form",
              className: "bg-destructive text-destructive-foreground",
            })
          }
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      form.reset({
        link: "",
      })
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
          className="btn btn-secondary focus-visible:ring-secondary flex h-8 justify-center"
        >
          {isFillingForm ? (
            <>
              <LoaderCircle className="animate-spin justify-self-end stroke-2" />
              <p className="justify-self-start font-medium capitalize">
                autofilling your form...
              </p>
            </>
          ) : (
            <>
              <p className="font-medium capitalize">autofill</p>
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
