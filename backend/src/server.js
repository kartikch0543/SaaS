import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { initializeFirebaseAdmin } from "./config/firebase.js";

const startServer = async () => {
  await connectDatabase();
  initializeFirebaseAdmin();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`StudyForge AI API running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
