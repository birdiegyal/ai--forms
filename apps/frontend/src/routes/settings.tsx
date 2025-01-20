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

  function handleSignout(e: React.MouseEvent<SVGSVGElement>) {
    e.preventDefault()
    if (session !== undefined) {
      signout(session.$id)
      toast({
        title: "Session deleted",
        description: "You have been signed out of your account.",
      })
    } else {
      toast({
        title: "Session not found.",
        description: "session is not found using context.",
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
          className="bg-destructive/10 border-destructive group flex w-max items-center border transition-all"
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin justify-self-end stroke-2" />
              <p className="justify-self-start font-medium capitalize">
                deleting...
              </p>
            </>
          ) : (
            <>
              <LogOut
                className="stroke-destructive group-hover:stroke-destructive-foreground justify-self-end"
                onClick={handleSignout}
              />
              <p className="text-destructive group-hover:text-destructive-foreground justify-self-start font-medium capitalize">
                log out
              </p>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
