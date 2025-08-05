import { Server } from "http";
import mongoose from "mongoose";
import { env } from "./app/config/env";
import app from "./app";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

async function main() {
  try {
    await mongoose.connect(env.DB_URL as string);
    console.log("Database Connected");

    server = app.listen(env.PORT, () => {
      console.log(`Server is listening on Port ${env.PORT}`);
    });
  } catch (error) {
    console.log("Server Error -> ", error);
  }
}

(async () => {
  await main();
  await seedSuperAdmin();
})();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved.. shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal recieved.. shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// handling unhandled rejection
process.on("unhandledRejection", (err) => {
  console.log("Unhandeld Rejection detected.. shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log("Uncought Exception detected.. Shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
