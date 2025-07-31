import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
}

const loadEnivronments = (): EnvConfig => {
  const requireEnvironments: string[] = ["PORT", "DB_URL"];

  requireEnvironments.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variables: ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const env = loadEnivronments();
