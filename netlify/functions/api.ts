import serverless from "serverless-http";
import { createServer } from "../../server";

let app: Awaited<ReturnType<typeof createServer>> | null = null;

async function getApp() {
  if (!app) {
    app = await createServer();
  }
  return app;
}

export const handler = async (event: any, context: any) => {
  const expressApp = await getApp();
  return serverless(expressApp)(event, context);
};
