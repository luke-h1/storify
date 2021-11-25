declare namespace NodeJS {
  interface ProcessEnv {
    POSTGRES_PASSWORD: string;
    POSTGRES_USER: string;
    CORS_ORIGIN_URL: string;
    DB_PORT: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    JWT_SECRET: string;
    DATABASE_URL: string;
  }
}
