import { DragEvent, MouseEvent, ReactNode, useRef, useState } from "react"
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
  const [files, setFiles] = useState<File[]>([])

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
    setFiles(Array.from(form.getValues("files")))
  }

  function onClick(e: MouseEvent) {
    e.preventDefault()
    filesInputRef.current?.showPicker()
  }

  function removeFile(e: MouseEvent, thisFile: File) {
    e.preventDefault()
    e.stopPropagation()
    setFiles((files) => files.filter((file) => file.name !== thisFile.name))
  }

  return (
    <div
      className="border-accent ring-secondary focus-visible:ring-ring flex h-full w-full flex-wrap place-items-center justify-center gap-4 overflow-y-auto rounded-lg border p-4 shadow-lg transition-all duration-200 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:ring-1"
      onDragEnter={makeDroppable}
      onDragOver={makeDroppable}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      onClick={onClick}
    >
      {files.length > 0 ? (
        files.map((file) => (
          <FilePreviewComponent file={file} removeFile={removeFile} />
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
        multiple={true}
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
      className="flex w-full items-center justify-between rounded-md border px-4 py-2"
      key={file.name}
    >
      <div className="flex items-center justify-center gap-4">
        <File></File>
        <div className="flex flex-col">
          <p className="text-foreground text-base">{file.name}</p>
          <p className="text-muted-foreground/50 text-sm">{`${file.size / 1e3} kb`}</p>
        </div>
      </div>
      <X
        className="stroke-destructive hover:bg-destructive/20 hover:border-destructive/40 rounded-full border-2 border-transparent transition-all"
        onClick={(e) => removeFile(e, file)}
      ></X>
    </div>
  )
}
