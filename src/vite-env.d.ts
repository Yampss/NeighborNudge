/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_REDDIT_CLIENT_ID: string
  readonly VITE_REDDIT_CLIENT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}