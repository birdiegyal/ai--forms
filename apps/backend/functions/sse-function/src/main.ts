export default async function ({ req, res, log }: any) {
  if (req.method === "OPTIONS") {
    return res.json("", 200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    })
  }

  let count = 0
  const sendEvents = () => {
    const now = new Date().toLocaleTimeString()
    return res.send(`${count}\n`, 200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    })
  }

  while (count < 10) {
    sendEvents()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    count++
  }

  return res.send("initiating...", 200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  })
}
