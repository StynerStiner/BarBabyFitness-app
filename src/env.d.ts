/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDFLARE_R2_ENDPOINT: string;
  readonly VITE_CLOUDFLARE_R2_ACCESS_KEY_ID: string;
  readonly VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY: string;
  readonly VITE_CLOUDFLARE_R2_BUCKET_NAME: string;
  readonly VITE_CLOUDFLARE_R2_PUBLIC_URL: string;
  readonly VITE_SERVER_URL: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
