import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  JWT_SECRET: string;
  JWT_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  EXPRESS_SESSION_SECRET: string;
  SALT: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADIN_PASSWORD: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  CLIENT_URL: string;
}

const loadEnivronments = (): EnvConfig => {
  const requireEnvironments: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "JWT_SECRET",
    "JWT_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "EXPRESS_SESSION_SECRET",
    "SALT",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADIN_PASSWORD",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "CLIENT_URL"
  ];

  requireEnvironments.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variables: ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES: process.env.JWT_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    SALT: process.env.SALT as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADIN_PASSWORD: process.env.SUPER_ADIN_PASSWORD as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    CLIENT_URL: process.env.CLIENT_URL as string
  };
};

export const env = loadEnivronments();
