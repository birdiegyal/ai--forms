const messagesEl = document.getElementById("messages") as HTMLUListElement

console.log(messagesEl)
// it keeps trying to reconnect.
const evtSource = new EventSource(
  `https://ryusywuubmyjondafdjc.supabase.co/functions/v1/sse-function`,
)

evtSource.onmessage = (event) => {
  console.log("message rcvd.")
  const li = document.createElement("li")
  li.textContent = event.data
  messagesEl.appendChild(li)
}

evtSource.onerror = () => {
  console.error("Error occurred while receiving SSE.")
}
