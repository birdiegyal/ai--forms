import { LogOut, LoaderCircle } from "lucide-react"
import { createFileRoute } from "@tanstack/react-router"
import CustomInstructionForm from "@/components/forms/customInstructionsForm"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useDeleteSession } from "@/lib/queriesAndMutations"
import { useSessionContext } from "@/components/session-provider"
import { toast } from "@/hooks/use-toast"

export const Route = createFileRoute("/settings")({
  component: Settings,
})

function Settings() {
  const { mutateAsync: signout, isPending } = useDeleteSession()
  const { session } = useSessionContext()

  function handleSignout(e: React.MouseEvent<HTMLButtonElement>) {
    console.log("signout")
    e.preventDefault()
    if (session !== undefined) {
      signout(session.$id)
      toast({
        title: "Session deleted",
        description: "You have been signed out of your account.",
        className: "bg-primary text-primary-foreground ",
      })
    } else {
      toast({
        title: "Session not found.",
        description: "session is not found using context.",
        className: "bg-destructive text-destructive-foreground ",
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-7">
      <div className="flex flex-col gap-5">
        <h1 className="font-display text-4xl capitalize">
          custom instructions
        </h1>
        <p className="text-sm">
          You can set custom instructions to change the way your cover letter,
          your “why hire me” answer, your strengths and weaknesses are generated
          from your uploaded files.
        </p>
        <CustomInstructionForm className="contents" />
        <Separator></Separator>
        <h1 className="font-display text-4xl capitalize">Profile</h1>
        {/* display user details here. */}
        <p className="text-sm">you will be signed out of your account. </p>

        <Button
          variant={"destructive"}
          className="btn btn-destructive flex h-10 w-max items-center font-bold capitalize rounded-xl"
          disabled={isPending}
          onClick={handleSignout}
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin justify-self-end stroke-2" />
              <p className="justify-self-start">deleting...</p>
            </>
          ) : (
            <>
              <LogOut className="justify-self-end" />
              <p className="justify-self-start">log out</p>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
