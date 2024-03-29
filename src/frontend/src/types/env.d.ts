declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_STORIFY_API_URL: string;
    NEXT_PUBLIC_CLOUDINARY_KEY: string;
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    NEXT_PUBLIC_STRIPE_PK: string;
    NEXT_PUBLIC_SITE_URL: string;
  }
}
