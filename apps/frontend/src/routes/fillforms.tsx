import Preview from "@/components/custom/preview"
import PasteLinkForm from "@/components/forms/pasteLinkForm"
import { createFileRoute, useSearch } from "@tanstack/react-router"
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
  // ResizablePrimitive,
} from "@/components/ui/resizable"
import { useFormData } from "@/lib/hooks"
import * as z from "zod"
import { useFillForm, useUpdateMagicSession } from "@/lib/queriesAndMutations"
import { dbConfig } from "@/lib/utils"
import { useSessionContext } from "@/components/session-provider"
import { useEffect } from "react"
import { toast } from "@/hooks/use-toast"

const formLinkSchema = z.object({
  link: z.string().url("enter form URL you would like to fill. "),
})

export const Route = createFileRoute("/fillforms")({
  component: FillForms,
})

function FillForms() {
  const searchParams: {
    userId: string
    secret: string
  } = useSearch({
    from: Route.id,
  })

  // create a session at the root level.
  const { setSession } = useSessionContext()


  const { data, isPending, isSuccess } = useUpdateMagicSession(
    searchParams.userId,
    searchParams.secret,
  )

  useEffect(() => {
    if (isSuccess) {
      setSession(data)
      // here's a txn.
      const openReq = indexedDB.open(dbConfig.dbName, dbConfig.dbVersion! || 1)
      openReq.onerror = dbConfig.onError
      openReq.onupgradeneeded = dbConfig.onUpgradeNeeded!
      openReq.onsuccess = () => {
        const db = openReq.result
        const addReq = db
          .transaction("session", "readwrite")
          .objectStore("session")
          .add(data, data?.userId)
        // you may want to add a retry mechanism in here.
        addReq.onerror = dbConfig.onError
      }
    }
  }, [isSuccess])

  const [formData, setFormData] = useFormData<z.infer<typeof formLinkSchema>>()
  const { mutateAsync, data: autofillRes } = useFillForm()
  const fillForm = async (resume: string, url: string) => await mutateAsync({ resume, url })

  if (data) {
    // toast for success
    toast({
      title: "Session is created",
      description: "you can start autofilling your forms now."
    })
  }

  if (isPending && Boolean(searchParams.userId)) {
    // toast for creating session.
    toast({
      title: "Creating session...",
      description: "please wait! creating a session for you."
    })
  }

  // pass this ref to the PasteLinkForm component
  // const refs = useRef<HTMLElement>()

  // use this when you want to resize the panels automatically on fill out click.
  // useEffect(() => {
  //   const previewPanel = ResizablePrimitive.getPanelElement("preview")
  //   if (previewPanel) {
  //     refs.current = previewPanel
  //   }
  // }, [])

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="size-full"
      id={"fillforms"}
    >
      <ResizablePanel
        defaultSize={0}
        maxSize={50}
        className="size-full"
        id="preview"
      >
        <Preview src={formData?.link!} autofillRes={autofillRes} />
      </ResizablePanel>
      <ResizableHandle className="bg-secondary/20 m-2 w-[2px] rounded-lg" />
      <ResizablePanel minSize={50} className="@container flex justify-center">
        <div
          className="@xl:w-1/2 w-full p-2"
          // className="sm:w-full lg:w-2/5 xl:w-1/2 2xl:w-1/3"
        >
          <PasteLinkForm
            fillForm={fillForm}
            setFormData={setFormData}
            formLinkSchema={formLinkSchema}
          />
          <div className="mt-7 flex flex-col gap-5">
            <h1 className="font-display text-4xl">History</h1>
            <div className="flex flex-col gap-2">
              <div className="border-accent bg-muted flex flex-col gap-1 rounded-lg border p-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs">Principal Engineer</h3>
                  <span className="bg-primary text-primary-foreground rounded-xl px-1 text-[10px]">
                    Submitted
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <p className="text-ellipsis">
                    Applied for a Principal Engineer Job role{" "}
                    <span className="text-primary">@Webflow</span>.
                  </p>
                  <p>7:19 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
