import { useState, createContext, useContext } from "react"
import { Models } from "appwrite"
import { SessionContextProps } from "@/lib/types"

const SessionContext = createContext<SessionContextProps>({
  session: undefined,
  setSession: () => {},
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Models.Session>()
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSessionContext() {
  return useContext(SessionContext)
}
