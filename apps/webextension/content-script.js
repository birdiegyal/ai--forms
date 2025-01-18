chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FILL_FORM") {
    console.log(message, sender, sendResponse)
    fillForm(message.data)
  }
})

function fillForm(formData) {
  for (const field of formData) {
    const { querySelector, value } = field
    document.querySelector(querySelector).setAttribute("value", value)
  }
}
