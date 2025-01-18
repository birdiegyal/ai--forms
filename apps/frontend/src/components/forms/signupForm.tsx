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
import { cn } from "@/lib/utils"
import React from "react"
import { useGetMagicLink } from "@/lib/queriesAndMutations"
import { toast } from "@/hooks/use-toast"

interface SignupFormProps extends React.HTMLAttributes<HTMLFormElement> {}

const signupFormSchema = z.object({
  email: z.string().email(),
})

export default function SignupForm({ className }: SignupFormProps) {
  const { mutateAsync: getMagicLink } = useGetMagicLink()
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
  })

  async function onSubmit(formData: z.infer<typeof signupFormSchema>) {
    console.log(formData)

    const res = await getMagicLink({
      email: formData.email,
      redirectTo:
        import.meta.env.VITE_REDIRECT_URL || "http://localhost:3001/fillforms", //port should be a param here.
    })

    if (res !== undefined) {
      toast({
        title: "Magic URL sent",
        description: "check your email inbox.",
      })
    }
    form.reset({
      email: "",
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("mt-8", className)}
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email"
                    className="h-8 border-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        ></FormField>

        <Button
          type="submit"
          className="btn focus-visible:ring-primary btn-primary h-8 transition-opacity"
        >
          Get magic URL
        </Button>
      </form>
    </Form>
  )
}
