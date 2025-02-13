import { cn } from "@/lib/utils"
import { forwardRef, useEffect, useRef, useState } from "react"
import { Ban, LoaderCircle, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface PreviewProps extends React.HTMLAttributes<HTMLIFrameElement> {
  src: string
  autofillRes: {
    querySelector: string
    value: string
  }[]
}

enum IframeStateEnum {
  Loading = "loading",
  Ready = "ready",
  Error = "error",
  Uninitialized = "uninitialized",
}

export default function Preview({
  src,
  autofillRes,
  className,
  ...props
}: PreviewProps) {
  const [iframeState, setIframeState] = useState<IframeStateEnum>(
    IframeStateEnum.Uninitialized,
  )

  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (Boolean(src)) {
      setIframeState(IframeStateEnum.Ready)
    }

    return () => {
      setIframeState(IframeStateEnum.Uninitialized)
    }
  }, [src])

  useEffect(() => {
    const readyState = iframeRef.current?.contentDocument?.readyState!
    switch (readyState) {
      case "loading":
        setIframeState(IframeStateEnum.Loading)
        break
      case "complete":
      case "interactive":
        setIframeState(IframeStateEnum.Ready)
        break
    }
  }, [iframeRef.current?.contentDocument?.readyState])

  useEffect(() => {
    if (iframeState && autofillRes?.length > 0) {
      const iframe = document.querySelector("iframe")
      if (iframe) {
        autofillRes.forEach(({ querySelector, value }) => {
          const el =
            iframe.contentWindow?.document?.querySelector(querySelector)
          if (el) {
            el.setAttribute("value", value)
          }
        })
      }
    }
  }, [iframeState, autofillRes])

  return (
    <div
      className={cn(
        "bg-accent/50 hover:bg-accent border-border group/preview text-md flex size-full items-center justify-center overflow-clip rounded-xl border shadow-lg transition-colors",
        className,
      )}
    >
      {iframeState === IframeStateEnum.Uninitialized && (
        <div className="flex items-center justify-center gap-4 p-8">
          <Info className="stroke-primary shrink-0" size={18} />
          {/* we can use a fixed height in here because this is never going to change to something more than this. */}
          <Separator
            decorative
            orientation="vertical"
            className="bg-foreground h-10 w-[2px] grow rounded-full"
          />
          <p className="text-left">
            paste the link in the input beside and preview your autofilled form
            here.
          </p>
        </div>
      )}

      {iframeState === IframeStateEnum.Ready && (
        <iframe
          {...props}
          src={`/proxy?url=${src}`}
          className="size-full"
          ref={iframeRef}
        ></iframe>
      )}

      {iframeState === IframeStateEnum.Loading && (
        <div className="flex items-center justify-center gap-4 p-8">
          <LoaderCircle className="animate-spin"></LoaderCircle>
          <p className="text-muted-foreground capitalize">loading preview...</p>
        </div>
      )}

      {iframeState === IframeStateEnum.Error && (
        <div className="flex items-center justify-center gap-4 p-8">
          <Ban className="stroke-destructive shrink-0" size={18}></Ban>
          <Separator
            decorative
            orientation="vertical"
            className="bg-foreground h-10 w-[2px] grow rounded-full"
          />
          <p className="capitalize">error rendering preview</p>
        </div>
      )}
    </div>
  )
}

// interface IframeProps extends React.HTMLAttributes<HTMLIFrameElement> {
//   src: string
//   autofillRes: {
//     querySelector: string
//     value: string
//   }[]
// }

// const Iframe = forwardRef<HTMLIFrameElement, IframeProps>(
//   ({ src, ...props }, ref) => {
//     // here goes the logic for auto filling the form
//     return (
//       <iframe
//         {...props}
//         className="size-full"
//         src={`/proxy/?url=${encodeURIComponent(src)}`}
//         ref={ref}
//       ></iframe>
//     )
//   },
// )
