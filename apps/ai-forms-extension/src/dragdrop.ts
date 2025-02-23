// create a class for this.
export const selectedFiles = new Map<string, File>()

// decl this as a method.
function add(...files: File[]) {
  // only add if not present.
  for (const file of files) {
    selectedFiles.set(file.name, file)
  }
}

// decl this as a method.
function remove(filename: string) {
  selectedFiles.delete(filename)
}

// decl this as a method.
function has(filename: string): Boolean {
  return selectedFiles.has(filename)
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  /* 
  > update the UI.
   */

  if (e.dataTransfer?.files) {
    const files = e.dataTransfer.files
    for (const file of files) {
      add(file)
    }
  }
}

function handleDragover(e: DragEvent) {
  e.preventDefault()
}

function handleClick(e: MouseEvent) {
  e.preventDefault()
  fileInput.showPicker()
}

const dropzone = document.querySelector("div#dropzone") as HTMLDivElement
const fileInput = dropzone.querySelector(
  "input#uploadFiles"
) as HTMLInputElement
const selectedFilesList = dropzone.querySelectorAll(
  "li.selectedFile"
) as NodeListOf<HTMLUListElement>
const selectedFilesUL = dropzone.querySelector(
  "div#selectedFiles > ul"
) as HTMLUListElement

dropzone.ondrop = handleDrop
dropzone.ondragover = handleDragover
dropzone.onclick = handleClick
dropzone.onkeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    fileInput.showPicker()
  }
}

fileInput.onchange = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const input = e.currentTarget as HTMLInputElement
  const files = input.files as FileList

  for (const file of files) {
    if (!has(file.name)) {
      add(file)
      selectedFilesUL.appendChild(
        addLI(file.name, (e) => {
          e.preventDefault()
          e.stopPropagation()
          remove(file.name)
          const deleteButton = e.currentTarget as HTMLButtonElement
          selectedFilesUL.removeChild(deleteButton.parentNode!)
        })
      )
    }
  }
}

selectedFilesList.forEach((file) => {
  file.onclick = (e) => {
    e.stopPropagation()
  }

  file.onmouseover = (e) => {
    e.stopPropagation()
  }
})

function addLI(
  filename: string,
  deleteCb: (e: MouseEvent) => void
): HTMLLIElement {
  const li = document.createElement("li")
  li.classList.add("selectedFile")
  const filenameLen = filename.length
  const p = document.createElement("p")
  p.textContent =
    filenameLen > 30
      ? filename.slice(0, 15) +
        "..." +
        filename.slice(18, 27) +
        "." +
        filename.split(".")[1]
      : filename
  li.appendChild(p)
  const button = li.appendChild(document.createElement("button"))
  button.innerHTML = `
  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="stroke-red-500"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
  `
  button.onclick = deleteCb
  li.append(button)

  return li
}
