import { createFileRoute, Navigate } from "@tanstack/react-router"
import { useSessionContext } from "@/components/session-provider"

export const Route = createFileRoute("/")({
  component: HomeComponent,
})

function HomeComponent() {
  const { session, setSession } = useSessionContext()
  // if there's no session found in the idb, then we need to redirect to the signup page. else redirect to fill forms page.
  
  if (session) {
    return <Navigate to="/fillforms" />
  }

  return <Navigate to="/signup" />
}
