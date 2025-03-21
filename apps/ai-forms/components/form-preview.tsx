import { Expand, BookCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FormPreview() {
  return (
    <div className="h-fit w-full">
      <div className="bg-secondary/50 flex w-full items-center justify-between rounded-t-sm p-2.5">
        <p className="capitalize">preview</p>
        <div className="flex items-center justify-center gap-2.5">
          <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
            <Expand className="size-6 stroke-1" />
          </Button>

          <Button
            variant="ghost"
            className="cursor-pointer items-center justify-center gap-2 rounded-md text-sm has-[>svg]:py-1"
          >
            <BookCheck className="size-6 stroke-1" />
            <p className="capitalize">publish</p>
          </Button>
        </div>
      </div>
      {/* we got to render the form in here. */}
      <div className="bg-secondary/30 h-52 w-full rounded-b-sm"></div>
    </div>
  )
}
