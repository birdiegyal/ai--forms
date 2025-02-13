import cors from "cors"
import express, { Request, Response, NextFunction } from "express"
import {
  createProxyMiddleware,
  Options,
  responseInterceptor
} from "http-proxy-middleware"
import { loadBuffer } from "cheerio"

const app = express()
app.use(cors())

// @ts-ignore
app.use("/", function (req: Request, res: Response, next: NextFunction) {
  const targetUrl = req.query.url as string

  if (!targetUrl) {
    return res.status(400).send("Target URL is required")
  }

  console.log("Proxying to:", targetUrl)

  const proxyOpts: Options = {
    target: targetUrl,
    changeOrigin: true,
    timeout: 30000,
    proxyTimeout: 30000,
    followRedirects: true,
    selfHandleResponse: true,
    secure: false,
    on: {
      proxyRes: responseInterceptor(async (responseBuffer, proxyRes) => {
        proxyRes.headers["Access-Control-Allow-Origin"] = "*"

        // you only want to do this if mime type of the response is plain/html
        console.log(proxyRes.headers)
        
        const html = loadBuffer(responseBuffer)
        return responseBuffer
      })
    }
  }

  const proxyMiddleware = createProxyMiddleware(proxyOpts)
  proxyMiddleware(req, res, next)
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`)
})
