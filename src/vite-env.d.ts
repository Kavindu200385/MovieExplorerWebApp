/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_TMDB_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
