/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_JWT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
