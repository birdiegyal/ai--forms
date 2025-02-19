export function viewTransition() {
  // document.startViewTransition(() => {
    // THIS IS A SECTION ELEMENT BTW.
    const dataPolicy = document.querySelector(
      "section#dataPolicy"
    ) as HTMLDivElement
    dataPolicy.classList.toggle("invisible")

    // THIS IS A SECTION ELEMENT BTW.
    const autofillForm = document.querySelector(
      "section#autofill"
    ) as HTMLDivElement
    autofillForm.classList.toggle("invisible")
    updateFooter()
  // })
}

export function onsubmit(e: SubmitEvent) {
  const formData = new FormData(e.currentTarget as HTMLFormElement)
  alert(JSON.stringify(formData, undefined, 4))
}

function updateFooter() {
  const separator = document.querySelector("div#separator") as HTMLDivElement
  const dataPolicyLink = document.querySelector(
    "a#dataPolicy"
  ) as HTMLParagraphElement

  if (separator && dataPolicyLink) {
    separator.style.display =
      separator.style.display === "none" ? "block" : "none"
    dataPolicyLink.style.display =
      dataPolicyLink.style.display === "none" ? "block" : "none"
  }
}



