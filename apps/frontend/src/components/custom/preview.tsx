import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

interface PreviewProps extends React.HTMLAttributes<HTMLIFrameElement> {
  src: string
  autofillRes: {
    querySelector: string
    value: string
  }[]
}

export default function Preview({
  src,
  autofillRes,
  className,
  ...props
}: PreviewProps) {
  const [iframeReady, setIframeReady] = useState<Boolean>(false)

  useEffect(() => {
    // console.log("filling form", iframeReady, typeof autofillRes)
    if (iframeReady && autofillRes?.length > 0) {
      const iframe = document.querySelector("iframe")
      if (iframe) {
        autofillRes.forEach(({ querySelector, value }) => {
          const el =
            iframe.contentWindow?.document?.querySelector(querySelector)
          if (el) {
            el.setAttribute("value", value)
          }

          console.log(el)
        })
      }
    }
  }, [iframeReady, autofillRes])

  return (
    <div
      className={cn(
        "flex size-full items-center justify-center overflow-clip rounded-lg border shadow-lg",
        className,
      )}
    >
      {src ? (
        // add loading response.
        <iframe
          src={`http://localhost:3001/proxy/?url=${encodeURIComponent(src)}`}
          {...props}
          className="size-full"
          sandbox="allow-forms allow-modals allow-scripts"
          referrerPolicy="same-origin"
          allow={`geolocation 'self' ${src}`}
          onLoad={() => {
            setIframeReady(true)
          }}
        />
      ) : (
        <div>no preview</div>
      )}
    </div>
  )
}
