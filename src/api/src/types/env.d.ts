declare namespace NodeJS {
  interface ProcessEnv {
    CORS_ORIGIN: string;
    SESSION_SECRET: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    FRONTEND_URL: string;
    CLOUDINARY_SECRET: string;
    STRIPE_SECRET_KEY: string;
  }
}
