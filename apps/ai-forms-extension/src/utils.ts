import { selectedFiles } from "./dragdrop"
import {
  type Message,
  EventType,
  type FormValues,
  AutofillMessage,
  ScrapeResultMessage
} from "./types"

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

export async function onsubmit(e: SubmitEvent) {
  e.preventDefault()

  const button = e.submitter as HTMLButtonElement
  const p = button.querySelector("p") as HTMLParagraphElement

  try {
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    formData.delete("uploadFiles")

    for (const file of selectedFiles.values()) {
      formData.append("uploadFiles", file)
    }

    const { id } = await getCurrentTab()

    button.removeChild(button.querySelector("svg") as SVGElement)
    p.classList.add("animate-pulse")
    p.innerText = "requesting"

    const synResponse = await new Promise<Message>((resolve, reject) => {
      chrome.tabs.sendMessage<Message, Message>(
        id as number,
        {
          type: "syn"
        },
        (response) => {
          if (response && response.type === "ack") resolve(response)
          else reject(new Error("ack not received"))
        }
      )
    })

    const scrapeResponse = await new Promise<ScrapeResultMessage>(
      (resolve, reject) => {
        if (synResponse.type === "ack") {
          chrome.tabs.sendMessage<Message, ScrapeResultMessage>(
            id as number,
            {
              type: "scrape"
            },
            (response) => {
              if (response.type === "scrapingResult") resolve(response)
              else reject(new Error("scrapingResult not received"))
            }
          )
        }
      }
    )

    if (scrapeResponse.type === "scrapingResult")
      formData.set("HTML", scrapeResponse.scrapedHtml)

    const fetchRes = await fetch(import.meta.env.VITE_SUPABASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_JWT}
        `
      },
      body: formData
    })

    if (!fetchRes.ok) {
      throw new Error("POST:sse failed")
    }

    const readableStream = fetchRes.body
    const textDecoder = new TextDecoder()

    if (readableStream) {
      const streamReader = readableStream.getReader()
      while (true) {
        const { done, value } = await streamReader.read()
        if (done) {
          break
        }
        const [eventString, dataString] = textDecoder.decode(value).split("\n")
        const eventType = eventString.split("event:")[1]?.trim() as EventType

        switch (eventType) {
          case EventType.autofillStarted:
            p.innerText = "Autofill started"
            break
          case EventType.formUnderstood:
            p.innerText = "Form understood"
            break
          case EventType.autofillCompleted:
            const data = dataString.split("data:")[1].trim()
            let { formValues } = JSON.parse(data) as { formValues: string }
            const parsedFormValues: FormValues = JSON.parse(formValues)
            console.log(parsedFormValues)

            chrome.tabs.sendMessage<AutofillMessage, Message>(
              id as number,
              { type: "autofill", formValues: parsedFormValues },
              (response) => {
                if (response && response.type === "done")
                  p.textContent = "autofill completed"
              }
            )
            break

          case EventType.autofillFailed:
            p.innerText = "Autofill failed"
            break

          default:
            console.error(`unknown event type: ${eventType}`)
        }
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    button.innerHTML = `<svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-[var(--foreground)]"
          >
            <g id="icon">
              <path
                id="Vector"
                d="M12.034 12.681C11.9979 12.5906 11.9892 12.4915 12.0088 12.3962C12.0285 12.3008 12.0756 12.2133 12.1445 12.1445C12.2133 12.0756 12.3008 12.0285 12.3962 12.0088C12.4915 11.9892 12.5906 11.9979 12.681 12.034L21.681 15.534C21.7775 15.5717 21.8599 15.6384 21.9168 15.725C21.9737 15.8116 22.0023 15.9137 21.9987 16.0172C21.9951 16.1207 21.9594 16.2206 21.8966 16.3029C21.8337 16.3853 21.7469 16.4461 21.648 16.477L18.204 17.545C18.0486 17.593 17.9073 17.6783 17.7923 17.7933C17.6773 17.9083 17.592 18.0496 17.544 18.205L16.477 21.648C16.4461 21.7469 16.3853 21.8337 16.3029 21.8966C16.2206 21.9594 16.1207 21.9951 16.0172 21.9987C15.9137 22.0023 15.8116 21.9737 15.725 21.9168C15.6384 21.8599 15.5717 21.7775 15.534 21.681L12.034 12.681Z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_2"
                d="M21 11V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H11"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>

          <p>autofill</p>`
  }
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

async function getCurrentTab() {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  })
  return tab
}
