declare namespace NodeJS {
  interface ProcessEnv {
    POSTGRES_PASSWORD: string;
    POSTGRES_USER: string;
    DB_HOST: string;
    DB_PORT: string;
    POSTGRES_DB: string;
    DATABASE_URL: string;
    CORS_ORIGIN_URL: string;
    PORT: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    JWT_SECRET: string;
  }
}
