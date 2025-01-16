import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "@/routeTree.gen"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultViewTransition: true,
})

const client = new QueryClient()

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById("app")!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}
