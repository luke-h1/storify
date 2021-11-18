declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
    JWT_SECRET: string;
    PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
  }
}
