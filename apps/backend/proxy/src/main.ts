import cors from "cors"
import express, { Request, Response, NextFunction } from "express"
import { createProxyMiddleware, Options } from "http-proxy-middleware"

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
    secure: false,
    on: {
      proxyRes: (proxyRes, req, res) => {
        proxyRes.headers["Access-Control-Allow-Origin"] = "*"
      }
    }
  }

  const proxyMiddleware = createProxyMiddleware(proxyOpts)
  proxyMiddleware(req, res, next)
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`)
})
