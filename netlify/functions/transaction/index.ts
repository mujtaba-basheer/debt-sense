import type { Config } from "@netlify/functions";
import { handlePost } from "./transaction-add";
import { handleGetList } from "./transaction-list";
import { handleGetSummary } from "./transaction-summary";
import { verifyAuth, requireAdmin, authErrorResponse } from "../lib/auth";

export const config: Config = {
  path: ["/api/transaction", "/api/transaction/summary"],
};

export default async function handler(req: Request) {
  const isSummary = new URL(req.url).pathname.endsWith("/summary");

  try {
    switch (req.method) {
      case "GET":
        verifyAuth(req);
        return isSummary ? handleGetSummary() : handleGetList();
      case "POST":
        requireAdmin(req);
        return handlePost(req);
      default:
        return new Response("Method Not Allowed", { status: 405 });
    }
  } catch (err) {
    return authErrorResponse(err);
  }
}
