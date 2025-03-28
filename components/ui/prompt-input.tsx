"use client"

import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, CircleStop } from "lucide-react"
import Link from "next/link"
import { ActionType } from "@/app/session/[session_id]/page"

type PromptInputContextType = {
  isLoading: boolean
  value: string
  setValue: (value: string) => void
  maxHeight: number | string
  onSubmit?: (value: string) => void
  disabled?: boolean
}

type ButtonState = "submit" | "stop"

const PromptInputContext = createContext<PromptInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false
})

export function usePromptInput() {
  const context = useContext(PromptInputContext)
  if (!context) {
    throw new Error("usePromptInput must be used within a PromptInput")
  }
  return context
}

type PromptInputProps = {
  isLoading?: boolean
  value?: string
  onValueChange?: (value: string) => void
  maxHeight?: number | string
  onSubmit?: (value: string) => void
  children: React.ReactNode
  className?: string
}

function PromptInput({
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onValueChange,
  onSubmit,
  children
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState(value || "")

  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <TooltipProvider>
      <PromptInputContext.Provider
        value={{
          isLoading,
          value: value ?? internalValue,
          setValue: onValueChange ?? handleChange,
          maxHeight,
          onSubmit
        }}
      >
        <div
          className={cn(
            "border-input bg-background shadow-xs rounded-3xl border p-2",
            className
          )}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  )
}

export type PromptInputTextareaProps = {
  disableAutosize?: boolean
  stop: () => void
  isLoading: boolean
  navigateTo?: string
  dispatch?: (action: ActionType) => void
} & React.ComponentProps<typeof Textarea>

function PromptInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  stop,
  isLoading: isGeneratingObject,
  navigateTo,
  dispatch,
  ...props
}: PromptInputTextareaProps) {
  const { value, setValue, maxHeight, onSubmit, disabled, isLoading } =
    usePromptInput()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (disableAutosize) return

    if (!textareaRef.current) return
    textareaRef.current.style.height = "auto"
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`
  }, [value, maxHeight, disableAutosize])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      // dispatch a "add" action with "user" role
      if (dispatch !== undefined) {
        dispatch({
          role: "user",
          content: value,
          type: "add"
        })
      } else {
        console.error("dispatch is undefined")
      }
      try {
        onSubmit?.(value)
      } finally {
        setValue("")
      }
    }
    onKeyDown?.(e)
  }

  return (
    <>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "text-primary min-h-[44px] w-full resize-none border-none bg-transparent caret-orange-400 shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
          className
        )}
        rows={1}
        {...props}
      />
      <PromptInputActions className="justify-end pt-2">
        {!navigateTo ? (
          <Button
            variant="ghost"
            size="icon"
            className="bg-background cursor-pointer rounded-full border-2 [&_svg_rect]:fill-red-400 [&_svg_rect]:stroke-red-400"
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (dispatch) {
                dispatch({
                  role: "user",
                  content: value,
                  type: "add"
                })
              }
              try {
                !isGeneratingObject ? onSubmit?.(value) : stop()
              } finally {
                setValue("")
              }
            }}
          >
            {!isGeneratingObject ? (
              <ArrowUp className="size-6" />
            ) : (
              <CircleStop className="size-6" />
            )}
          </Button>
        ) : (
          <Link
            href={`${navigateTo}?prompt=${value}`}
            className="bg-background hover:bg-accent/50 cursor-pointer rounded-full border-2 p-1 transition-colors [&_svg_rect]:fill-red-400 [&_svg_rect]:stroke-red-400"
          >
            <ArrowUp className="size-6" />
          </Link>
        )}
      </PromptInputActions>
    </>
  )
}

type PromptInputActionsProps = React.HTMLAttributes<HTMLDivElement>

function PromptInputActions({
  children,
  className,
  ...props
}: PromptInputActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}

type PromptInputActionProps = {
  className?: string
  tooltip: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
} & React.ComponentProps<typeof Tooltip>

function PromptInputAction({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: PromptInputActionProps) {
  const { disabled } = usePromptInput()

  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction
}
