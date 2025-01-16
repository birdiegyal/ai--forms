export type dbConfigType = {
  dbName: string
  storeName?: string
  dbVersion?: number
  onError: (e: Event) => any | null
  onSuccess?: (e: Event) => any | null
  onUpgradeNeeded?: (e: IDBVersionChangeEvent) => any | null
  onBlocked?: (e: IDBVersionChangeEvent) => any | null
}
