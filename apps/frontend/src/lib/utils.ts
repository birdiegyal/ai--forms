import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { dbConfigType } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const dbConfig: dbConfigType = {
  dbName: "documentStore",
  storeName: "resume",
  onError: (e) => {
    console.error("failed", e)
  },
  onSuccess: (e) => {
    console.log("succeed", e)
  },
  onBlocked: (e) => {
    console.warn("blocked access", e)
  },
  onUpgradeNeeded: (e) => {
    const req = e.target as IDBOpenDBRequest
    const db = req.result
    db.createObjectStore("resume")
  }
}