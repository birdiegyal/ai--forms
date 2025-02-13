function onsubmit(e: SubmitEvent) {
  const formData = new FormData(e.currentTarget as HTMLFormElement)
  alert(JSON.stringify(formData, undefined, 4))
}

const form = document.querySelector("form") as HTMLFormElement
form.onsubmit = onsubmit