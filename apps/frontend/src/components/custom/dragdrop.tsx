import {
  DragEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"
import FileUploadIcon from ">/visuals/uploadFiles.svg"
import { Input } from "@/components/ui/input"
import { useFormContext, useWatch } from "react-hook-form"
import { File, X } from "lucide-react"
interface DragDropProps {
  name: string
  onChange: (...e: any[]) => void
}

export function DragDrop({ name, onChange }: DragDropProps) {
  const filesInputRef = useRef<HTMLInputElement>(null)
  const form = useFormContext()
  const fileRef = form.register(name)
  const formValues: FileList | undefined = useWatch({
    name,
    defaultValue: undefined,
  })

  function makeDroppable(e: DragEvent<HTMLDivElement>) {
    // go through the files and only accept file type application/pdf.
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
    e.currentTarget.classList.add("bg-primary/10", "border-primary")
  }

  function onDragLeave(e: DragEvent<HTMLDivElement>) {
    e.currentTarget.classList.remove("bg-primary/10", "border-primary")
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    // dont let browser to open the file.
    e.preventDefault()
    e.currentTarget.classList.remove("bg-primary/10", "border-primary")
    // access dropped file
    onChange(e.dataTransfer.files)
  }

  function onClick(e: MouseEvent) {
    e.preventDefault()
    filesInputRef.current?.showPicker()
    // to allow uploading the same file twice in a row.
    filesInputRef.current!.value = ""
  }

  function removeFile(e: MouseEvent, thisFile: File) {
    e.preventDefault()
    e.stopPropagation()
    form.setValue(
      name,
      Array.from(formValues!).filter((file) => file.name !== thisFile.name),
    )
  }

  return (
    <div
      className="border-border ring-secondary focus-visible:ring-ring flex h-full w-full flex-wrap place-items-center justify-center gap-4 overflow-y-auto rounded-xl border p-4 shadow-lg transition-all duration-200 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:ring-1"
      onDragEnter={makeDroppable}
      onDragOver={makeDroppable}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      onClick={onClick}
    >
      {formValues !== undefined && Object.keys(formValues).length !== 0 ? (
        Array.from(formValues).map((file) => (
          <FilePreviewComponent
            file={file}
            removeFile={removeFile}
            key={file.name}
          />
        ))
      ) : (
        <img
          src={FileUploadIcon}
          alt="file uploadd icon"
          className="select-none sm:aspect-square"
        />
      )}
      <Input
        {...fileRef}
        type="file"
        accept=".pdf"
        className="hidden"
        ref={filesInputRef}
        onChange={(e) => {
          onChange(e.currentTarget.files)
        }}
      />
    </div>
  )
}

function FilePreviewComponent({
  file,
  removeFile,
}: {
  file: File
  removeFile: (e: MouseEvent, file: File) => void
}) {
  return (
    <div
      className="hover:bg-accent/50 group flex w-full items-center justify-between rounded-md border px-4 py-2 transition-all"
      onClick={(e) => e.stopPropagation()}
    >
      <File size={24} />
      <div className="flex w-10/12 flex-col gap-1">
        <p className="text-foreground w-full truncate text-base">{file.name}</p>
        <span className="text-muted-foreground/50 text-sm">{`${file.size / 1e3} KB`}</span>
      </div>
      <X
        className="stroke-destructive/50 hover:bg-destructive/20 hover:border-destructive/40 hover:stroke-destructive invisible justify-self-end rounded-md border-2 border-transparent transition-all group-hover:visible"
        size={24}
        onClick={(e) => removeFile(e, file)}
      ></X>
    </div>
  )
}
