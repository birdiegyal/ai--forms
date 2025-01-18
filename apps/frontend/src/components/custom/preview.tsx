import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

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
          src={src}
          {...props}
          className="size-full"
          sandbox="allow-forms allow-modals allow-scripts"
          referrerPolicy="same-origin"
          allow={`geolocation 'self' ${src}`}
        />
      ) : (
        <div>no preview</div>
      )}
    </div>
  )
}
