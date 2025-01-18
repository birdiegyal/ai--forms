import { Models } from "appwrite"

export type dbConfigType = {
  dbName: string
  storeName?: string
  dbVersion?: number
  onError: (e: Event) => any | null
  onSuccess?: (e: Event) => any | null
  onUpgradeNeeded?: (e: IDBVersionChangeEvent) => any | null
  onBlocked?: (e: IDBVersionChangeEvent) => any | null
}

export type SessionContextProps = {
  session: Models.Session | undefined
  setSession: React.Dispatch<React.SetStateAction<Models.Session | undefined>>
}
