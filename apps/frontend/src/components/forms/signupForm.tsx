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
import { cn } from "@/lib/utils"
import React from "react"
import { useGetMagicLink } from "@/lib/queriesAndMutations"
import { toast } from "@/hooks/use-toast"

interface SignupFormProps extends React.HTMLAttributes<HTMLFormElement> {}

const signupFormSchema = z.object({
  email: z.string().email(),
})

export default function SignupForm({ className }: SignupFormProps) {
  const { mutateAsync: getMagicLink, isPending } = useGetMagicLink()
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
  })

  async function onSubmit(formData: z.infer<typeof signupFormSchema>) {
    try {
      const res = await getMagicLink({
        email: formData.email,
        redirectTo:
          // import.meta.env.VITE_REDIRECT_URL ||
          "http://localhost:3001/fillforms", //port should be a param here.
      })

      if (res !== undefined) {
        toast({
          title: "Magic URL sent",
          description: "check your email inbox.",
          className: "bg-primary text-primary-foreground ",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Magic URL not sent",
        className: "bg-destructive text-destructive-foreground ",
      })
    } finally {
      form.reset({
        email: "",
      })
    }
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
          className="btn focus-visible:ring-primary btn-primary flex h-8 justify-center transition-opacity"
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin justify-self-end stroke-2" />
              <p className="justify-self-start font-medium capitalize">
                getting magic url...
              </p>
            </>
          ) : (
            <>
              <p className="font-medium capitalize">Get magic URL</p>
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
