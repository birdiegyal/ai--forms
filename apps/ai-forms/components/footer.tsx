"use client"

import { usePathname } from "next/navigation"

export default function Footer() {
  const currentPath = usePathname()

  if (currentPath !== "/") return <></>
  
  return (
    <footer className="invisible flex flex-col items-start justify-center gap-2.5 text-sm lg:visible">
      <p className="font-medium capitalize">keyboard shortcuts</p>
      <div className="flex items-start justify-center gap-5 selection:text-white">
        <div className="flex items-center justify-center">
          <code className="mr-1 capitalize text-orange-400">ctrl+i:</code>
          <p className="opacity-60">to focus prompt input</p>
        </div>

        <div className="flex items-center justify-center">
          <code className="mr-1 capitalize text-orange-400">ctrl+enter:</code>
          <p className="opacity-60">to send </p>
        </div>

        <div className="flex items-center justify-center">
          <code className="mr-1 capitalize text-orange-400">ctrl+p:</code>
          <p className="opacity-60">to publish</p>
        </div>
        <div className="flex items-center justify-center">
          <code className="mr-1 capitalize text-orange-400">ctrl+n:</code>
          <p className="opacity-60">new session</p>
        </div>
        <div className="flex items-center justify-center">
          <code className="mr-1 capitalize text-orange-400">ctrl+,:</code>
          <p className="opacity-60">open settings</p>
        </div>
      </div>
    </footer>
  )
}
