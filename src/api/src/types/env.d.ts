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
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    AWS_SES_FROM_EMAIL_ADDRESS: string;
  }
}
