declare namespace NodeJS {
  interface ProcessEnv {
    CORS_ORIGIN: string;
    DB_PORT: number;
    SESSION_SECRET: string;
    REDIS_URL: string;
    DB_PORT: number;
    FRONTEND_URL: string;
    CLOUDINARY_SECRET: string;
    STRIPE_SECRET_KEY: string;
    MAILGUN_API_KEY: string;
    EMAIL_DOMAIN_NAME: string;
    CI: string;
  }
}
