"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { formField } from "@/app/api/chat/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ControllerRenderProps, useForm } from "react-hook-form"
import { getZodSchemaFromStructuredOutput, getZeroValues } from "@/lib/utils"
import { z } from "zod"
import { toast } from "sonner"

interface FormPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  formFields: z.infer<typeof formField>[]
}

export default function FormPreview({
  formFields,
}: FormPreviewProps) {
  const formSchema = getZodSchemaFromStructuredOutput(formFields)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getZeroValues(formFields),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast("Form submitted", {
      style: {
        width: "fit-content",
        color: "var(--color-green-400)",
      },
      description: (
        <pre className="size-fit p-1 bg-background rounded-xl overflow-auto text-xs">
          <code>{JSON.stringify(values, null, 1)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="bg-secondary/30 grid w-full grid-cols-2 gap-4 rounded-b-sm p-4 lg:px-36">
          {formFields.map((formField) => {
            return (
              <FormField
                key={formField.name}
                control={form.control}
                name={formField.name}
                render={({ field }) => (
                  <Field formField={formField} {...field} />
                )}
              />
            )
          })}
          <Button type="submit" className="col-span-2 justify-center">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

type FieldProps = {
  formField: z.infer<typeof formField>
} & ControllerRenderProps<
  {
    [x: string]: any
  },
  string
>

function Field({ formField, ...props }: FieldProps) {
  switch (formField.type) {
    case "text":
    case "email":
    case "tel":
    case "file": {
      return (
        <FormItem>
          <FormLabel className="capitalize">{formField.name}</FormLabel>
          <FormControl>
            <Input
              placeholder={formField.placeholder}
              type={formField.type}
              {...props}
            />
          </FormControl>
          <FormMessage className="selection:bg-red-500! selection:text-white" />
        </FormItem>
      )
    }
    case "checkbox":
      return (
        <FormItem className="col-span-2 flex items-start gap-2">
          <FormControl>
            <Checkbox
              checked={props.value}
              onCheckedChange={props.onChange}
            ></Checkbox>
          </FormControl>
          <FormLabel className="capitalize">{formField.name}</FormLabel>
          <FormMessage className="selection:bg-red-500! selection:text-white" />
        </FormItem>
      )
  }
}
