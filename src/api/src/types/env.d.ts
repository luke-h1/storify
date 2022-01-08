declare namespace NodeJS {
  interface ProcessEnv {
    CORS_ORIGIN: string;
    DATABASE_URL: string;
    SESSION_SECRET: string;
    REDIS_URL: string;
    PORT: string;
    FRONTEND_URL: string;
    CLOUDINARY_SECRET: string;
    STRIPE_SECRET_KEY: string;
    SENDGRID_API_KEY: string;
  }
}
